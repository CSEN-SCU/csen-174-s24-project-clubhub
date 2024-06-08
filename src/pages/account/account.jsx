import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth, firestore, storage } from "../../Firebase";
import { signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  deleteDoc,
  query,
  orderBy,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import "./account.css";
import FollowButton from "../../components/follow/FollowButton";
import AccPost from "./AccPost";
import DeletePost from "./DeletePost";
import imageCompression from "browser-image-compression";
import { GithubPicker } from "react-color";

function Account() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [tempProfilePic, setTempProfilePic] = useState("");
  const navigate = useNavigate();
  const [bio, setBio] = useState("Tell the community about yourself...");
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [showHighlighted, setShowHighlighted] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [highlightedPosts, setHighlightedPosts] = useState([]);
  const [characterCount, setCharacterCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [tempBackgroundColor, setTempBackgroundColor] = useState("#ffffff"); // Default color
  const [searchParams] = useSearchParams();
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [userType, setUserType] = useState("");
  const [likedPosts, setLikedPosts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  let userId;
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const openDeleteModal = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, text.lastIndexOf(" ", maxLength)) + "...";
  };

  useEffect(() => {
    fetchUserInfo();
    fetchUserPosts();
    fetchHighlightedPosts();
  }, [searchParams.get("id")]);

  if (!searchParams.get("id")) {
    userId = localStorage.getItem("userId");
  } else {
    if (localStorage.getItem("userId") === searchParams.get("id")) {
      navigate("/account");
    }
    userId = searchParams.get("id");
  }

  const renderFollowButton = () => {
    if (userId !== localStorage.getItem("userId")) {
      return (
        <FollowButton
          currentUserId={localStorage.getItem("userId")}
          targetUserId={userId}
        />
      );
    }
    return null;
  };

  const fetchUserInfo = async () => {
    if (!userId) return;

    if (!searchParams.get("id")) {
      const cachedUserInfo = localStorage.getItem(`userInfo_${userId}`);
      if (cachedUserInfo) {
        const userData = JSON.parse(cachedUserInfo);
        setName(userData.name);
        setEmail(userData.email);
        setBio(userData.bio || "Tell the community about yourself...");
        setProfilePic(userData.profilePic || "");
        setBackgroundColor(userData.backgroundColor || "#ffffff");
        setUserType(userData.userType); // Set userType from cached data
        setFollowerCount(userData.follower ? userData.follower.length : 0);
        setFollowingCount(userData.following ? userData.following.length : 0);
        console.log("Using cached user info");
        return;
      }
    }

    const userRef = doc(firestore, "users", userId);
    try {
      const unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.name);
          setEmail(userData.email);
          setBio(
            userData.bio ||
              (searchParams.get("id")
                ? ""
                : "Tell the community about yourself...")
          );
          setProfilePic(userData.profilePic || "");
          setBackgroundColor(userData.backgroundColor || "#ffffff");
          setUserType(userData.userType); // Set userType from Firestore
          setFollowerCount(userData.follower ? userData.follower.length : 0);
          setFollowingCount(userData.following ? userData.following.length : 0);
          if (!searchParams.get("id")) {
            localStorage.setItem(
              `userInfo_${userId}`,
              JSON.stringify(userData)
            );
            console.log("Local storage userinfo set");
          }
        } else {
          console.log("No user data available");
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchUserPosts = async () => {
    if (!userId) return;

    if (!searchParams.get("id")) {
      const cachedUserPosts = localStorage.getItem(`userPosts_${userId}`);
      if (cachedUserPosts) {
        console.log("Using cached user posts");
        setUserPosts(JSON.parse(cachedUserPosts));
        return;
      }
    }

    try {
      const postsCollection = collection(firestore, "posts");
      const q = query(
        postsCollection,
        where("userID", "==", userId),
        orderBy("timestamp", "desc")
      );
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedPosts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserPosts(fetchedPosts);
          if (!searchParams.get("id")) {
            localStorage.setItem(
              `userPosts_${userId}`,
              JSON.stringify(fetchedPosts)
            );
            console.log("Local storage userposts set");
          }
        },
        (error) => {
          console.error("Error fetching posts:", error);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const fetchHighlightedPosts = async () => {
    if (!userId) return;

    if (!searchParams.get("id")) {
      const cachedHighlightedPosts = localStorage.getItem(
        `highlightedPosts_${userId}`
      );
      if (cachedHighlightedPosts) {
        setHighlightedPosts(JSON.parse(cachedHighlightedPosts));
        console.log("Using cached highlighted posts");
        return;
      }
    }

    const userRef = doc(firestore, "users", userId);

    try {
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const highlightedPostIds = userData.highlightedPosts || [];

        if (highlightedPostIds.length > 0) {
          const postsCollectionRef = collection(firestore, "posts");
          const postsQuery = query(
            postsCollectionRef,
            where("__name__", "in", highlightedPostIds)
          );

          onSnapshot(postsQuery, (snapshot) => {
            const postData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setHighlightedPosts(postData);
            if (!searchParams.get("id")) {
              localStorage.setItem(
                `highlightedPosts_${userId}`,
                JSON.stringify(postData)
              );
              console.log("Local storage highlightedposts set");
            }
          });
        } else {
          setHighlightedPosts([]);
        }
      } else {
        console.log("User document does not exist.");
      }
    } catch (error) {
      console.error("Error fetching highlighted posts:", error);
    }
  };

  const fetchLikedPosts = async () => {
    try {
      const userRef = doc(firestore, "users", userId);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const likedPostIds = userData.likedPosts || [];
        const fetchedPosts = await Promise.all(
          likedPostIds.map(async (postId) => {
            const postRef = doc(firestore, "posts", postId);
            const postSnapshot = await getDoc(postRef);
            if (postSnapshot.exists()) {
              return {
                id: postSnapshot.id,
                ...postSnapshot.data(),
              };
            }
            return null;
          })
        );
        return fetchedPosts.filter((post) => post !== null);
      }
      return [];
    } catch (error) {
      console.error("Error fetching liked posts:", error);
      return [];
    }
  };

  useEffect(() => {
    if (userType === "student") {
      fetchLikedPosts().then(setLikedPosts);
    }
  }, [userType]);

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    try {
      await deleteDoc(doc(firestore, "posts", postToDelete.id));
      console.log("Post deleted successfully");
      setUserPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== postToDelete.id)
      );
      setHighlightedPosts((prevHighlightedPosts) =>
        prevHighlightedPosts.filter((post) => post.id !== postToDelete.id)
      );
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleHighlightClick = async (postId) => {
    const userId = localStorage.getItem("userId");
    if (!userId || !postId) return;

    const userRef = doc(firestore, "users", userId);

    try {
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const highlightedPostIds = userData.highlightedPosts || [];

        if (highlightedPostIds.includes(postId)) {
          setHighlightedPosts((prevHighlightedPosts) =>
            prevHighlightedPosts.filter((post) => post.id !== postId)
          );

          await updateDoc(userRef, {
            highlightedPosts: arrayRemove(postId),
          });
          console.log("Post unhighlighted successfully!");
          localStorage.removeItem(`highlightedPosts_${userId}`);
        } else {
          await updateDoc(userRef, {
            highlightedPosts: arrayUnion(postId),
          });
          console.log("Post highlighted successfully!");
          localStorage.removeItem(`highlightedPosts_${userId}`);

          const postRef = doc(firestore, "posts", postId);
          const postSnapshot = await getDoc(postRef);
          if (postSnapshot.exists()) {
            const postData = { id: postSnapshot.id, ...postSnapshot.data() };
            setHighlightedPosts((prevHighlightedPosts) => [
              postData,
              ...prevHighlightedPosts,
            ]);
          }
        }
      } else {
        console.log("User document does not exist.");
      }
    } catch (error) {
      console.error("Error toggling highlight:", error);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("userId");
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedBio(bio);
    setTempBackgroundColor(backgroundColor);
  };

  const updateBio = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const userRef = doc(firestore, "users", userId);
    try {
      await updateDoc(userRef, {
        bio: editedBio,
      });
      console.log("Bio updated successfully!");
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  const handleSaveClick = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    if (tempProfilePic && isProfilePicChanged()) {
      setProfilePic(tempProfilePic);
      setTempProfilePic("");

      const userRef = doc(firestore, "users", userId);
      try {
        await updateDoc(userRef, {
          bio: editedBio,
          profilePic: tempProfilePic,
          backgroundColor: tempBackgroundColor,
        });
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    } else {
      await updateBio();
      await updateDoc(doc(firestore, "users", userId), {
        backgroundColor: tempBackgroundColor,
      });
    }

    setBackgroundColor(tempBackgroundColor);
    localStorage.removeItem(`userInfo_${userId}`);
    fetchUserInfo();
    setIsEditing(false);
  };

  const handleCancelClick = async () => {
    await deleteTempProfilePic();
    setIsEditing(false);
    setTempProfilePic("");
    setTempBackgroundColor(backgroundColor);
  };

  const deleteTempProfilePic = async () => {
    if (tempProfilePic && tempProfilePic !== profilePic) {
      const tempProfilePicRef = ref(storage, tempProfilePic);
      try {
        await deleteObject(tempProfilePicRef);
        console.log("Temporary profile picture deleted successfully.");
      } catch (error) {
        console.error("Error deleting temporary profile picture:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    setEditedBio(e.target.value);
    setCharacterCount(e.target.value.length);
  };

  const handleRegularClick = () => {
    setShowHighlighted(false);
  };

  const handleHighlightedClick = () => {
    setShowHighlighted(true);
  };

  const isProfilePicChanged = () => {
    return tempProfilePic && tempProfilePic !== profilePic;
  };

  const handleTextAreaClick = () => {
    if (bio === "Tell the community about yourself...") {
      setEditedBio("");
    }
  };

  const handleBackgroundColorChange = (color) => {
    const newColor = color.hex;
    setTempBackgroundColor(newColor);
  };

  const handleFileChange = (e) => {
    handleUpload(e.target.files[0]);
  };

  const handleUpload = async (file) => {
    if (!file) return;

    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 500,
      useWebWorker: true,
    };

    try {
      setIsLoading(true);
      const compressedFile = await imageCompression(file, options);
      const storageRef = ref(storage, `profilePics/${compressedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.error("Upload failed:", error);
          setIsLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setTempProfilePic(downloadURL);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Error compressing image:", error);
      setIsLoading(false);
    }
  };

  const renderBioSection = () => {
    const isProfileOwner = !searchParams.get("id");
    if (isEditing) {
      return (
        <div className="render__bio__container">
          <textarea
            value={editedBio}
            onClick={handleTextAreaClick}
            onChange={handleInputChange}
            rows="1"
            cols="30"
            maxLength="150"
            className="bio__textArea"
          />
          <span className="char__count">{characterCount}/150</span>
          <div className="acc__btn__container">
            <button className="btn save__btn" onClick={handleSaveClick}>
              Save
            </button>
            <button className="btn cancel__btn" onClick={handleCancelClick}>
              Cancel
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bio__option">
          <p className="bio__text">{bio}</p>
          {isProfileOwner && (
            <div className="acc__btn__container">
              <button className="btn edit__btn" onClick={handleEditClick}>
                Edit
              </button>
              <button onClick={handleLogout} className="logout-button btn">
                Log Out
              </button>
            </div>
          )}
        </div>
      );
    }
  };

  const renderPostButtons = (post) => {
    const isHighlighted = highlightedPosts.some(
      (highlightedPost) => highlightedPost.id === post.id
    );
    const starStyle = {
      cursor: "pointer",
      color: isHighlighted ? "#FFA500" : "grey",
      fontSize: "24px",
    };

    if (!searchParams.get("id")) {
      return (
        <div className="post-buttons">
          <span
            onClick={(e) => {
              e.stopPropagation();
              handleHighlightClick(post.id);
            }}
            style={starStyle}
            className="highlight-star"
          >
            ★
          </span>
          <FontAwesomeIcon
            icon={faTrashAlt}
            className="delete-icon"
            onClick={(e) => {
              e.stopPropagation();
              openDeleteModal(post);
            }}
          />
        </div>
      );
    }
    return null;
  };

  const renderPosts = () => {
    if (userType === "club owner") {
      // If user is a club owner, show regular and highlighted posts
      return (
        <>
          <div className="posts-tabs">
            <button
              onClick={handleRegularClick}
              className={`header__btn__acc ${!showHighlighted ? "active" : ""}`}
            >
              Regular Posts
            </button>
            <button
              onClick={handleHighlightedClick}
              className={`header__btn__acc ${showHighlighted ? "active" : ""}`}
            >
              Highlighted Posts
            </button>
          </div>
          <div className="posts-list">
            {showHighlighted ? (
              <div className="post__themselves">
                {highlightedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="post-item"
                    onClick={() => handlePostClick(post)}
                  >
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt="Flyer"
                        className="post-flyer"
                      />
                    )}
                    <div className="post-content">
                      <h4>{post.name}</h4>
                      <h3>{post.title}</h3>
                      <p>{truncateText(post.text, 115)}</p>
                    </div>
                    {renderPostButtons(post)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="post__themselves">
                {userPosts.map((post) => (
                  <div
                    key={post.id}
                    className="post-item"
                    onClick={() => handlePostClick(post)}
                  >
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt="Flyer"
                        className="post-flyer"
                      />
                    )}
                    <div className="post-content">
                      <h4>{post.name}</h4>
                      <h3>{post.title}</h3>
                      <p>{truncateText(post.text, 115)}</p>
                    </div>
                    {renderPostButtons(post)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      );
    } else if (userType === "student") {
      return (
        <>
          <div className="posts-tabs">
            <button
              onClick={handleRegularClick}
              className={`header__btn__acc ${!showHighlighted ? "active" : ""}`}
            >
              Your Liked Posts
            </button>
          </div>
          <div className="posts-list">
            {likedPosts.map((post) => (
              <div
                key={post.id}
                className="post-item"
                onClick={() => handlePostClick(post)}
              >
                <img src={post.imageUrl} alt="Flyer" className="post-flyer" />
                <div className="post-content">
                  <h4>{post.name}</h4>
                  <h3>{post.title}</h3>
                  <p>{truncateText(post.text, 115)}</p>
                </div>
                {/* You may need to add a different icon or indicator for liked posts */}
              </div>
            ))}
          </div>
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="account-container">
      <div
        className="top-half"
        style={{
          backgroundColor: isEditing ? tempBackgroundColor : backgroundColor,
        }}
      >
        <GithubPicker
          color={tempBackgroundColor}
          onChangeComplete={(color) => handleBackgroundColorChange(color)}
          className={`custom-picker ${
            isEditing ? "custom-picker-editing" : ""
          }`}
          triangle="hide"
        />

        <div className="profile-info">
          <label
            htmlFor="profilePicInput"
            className={isEditing ? "lower-opacity" : ""}
          >
            <div className="profile-pic-wrapper">
              <img src={tempProfilePic || profilePic} alt="Profile" />
              {isLoading ? (
                <div className="profile-spinner"></div>
              ) : (
                isEditing && (
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    className={`edit-icon ${
                      isEditing ? "icon-is-editing" : ""
                    }`}
                  />
                )
              )}
            </div>
          </label>

          <input
            id="profilePicInput"
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={handleFileChange}
            style={{ display: "none" }}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="bottom-half">
        <div className="bottom__half__container">
          <div className="nameEmailContainer">
            <h1>{name}</h1>
            <p>{email}</p>
            {renderFollowButton()}
          </div>
          <div className="following__container">
            {userType === "club owner" && (
              <>
                <h3>Followers</h3>
                <p>{followerCount}</p>
              </>
            )}
            {userType === "student" && (
              <>
                <h3>Following</h3>
                <p>{followingCount}</p>
              </>
            )}
          </div>
        </div>
        {renderBioSection()}
      </div>
      <div className="main-content">{renderPosts()}</div>
      {showModal && <AccPost closeModal={closeModal} post={selectedPost} />}
      {showDeleteModal && (
        <DeletePost
          closeModal={closeDeleteModal}
          post={postToDelete}
          deletePost={handleDeletePost}
        />
      )}
    </div>
  );
}

export default Account;
