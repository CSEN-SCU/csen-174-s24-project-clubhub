import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore, storage } from "../../Firebase";
import { signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  updateDoc,
  where
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import "./account.css";
import ACMH1 from "../../assets/ACMH1.png";
import ACMH2 from "../../assets/ACMH2.png";
import { useSearchParams } from "react-router-dom";
import FollowButton from "../../components/follow/FollowButton";
import AccPost from "./AccPost";

function Account() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const navigate = useNavigate();
  const [bio, setBio] = useState("Tell the community about yourself...");
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [showHighlighted, setShowHighlighted] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [highlightedPosts, setHighlightedPosts] = useState([]);
  const [characterCount, setCharacterCount] = useState(0);

  const [searchParams] = useSearchParams();

  let userId;
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

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

  if (searchParams.get("id") === "1111") {
    userId = localStorage.getItem("userId");
  } else {
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

  if (searchParams.get("id") === "1111") {
    userId = localStorage.getItem("userId");
  } else {
    userId = searchParams.get("id");
  }

  const fetchUserInfo = async () => {
    if (!userId) return;

    const userRef = doc(firestore, "users", userId);
    try {
      onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.name);
          setEmail(userData.email);
          setBio(userData.bio || "Tell the community about yourself...");
          setProfilePic(userData.profilePic || "");
        } else {
          console.log("No user data available");
        }
      });
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchUserPosts = async () => {
    if (!userId) return;

    try{
      const postsCollection = collection(firestore, "posts");
        const q = query(postsCollection, where('userID', '==', userId), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const fetchedPosts = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setUserPosts(fetchedPosts);
          },
          (error) => {
            console.error("Error fetching posts !!!:", error);
          }
        );

        return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const fetchHighlightedPosts = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
  
    const userRef = doc(firestore, "users", userId);
  
    try {
      // Fetch the user's highlighted post IDs
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const highlightedPostIds = userData.highlightedPosts || [];
  
        if (highlightedPostIds.length > 0) {
          // Fetch the highlighted posts from the posts collection
          const postsCollectionRef = collection(firestore, "posts");
          const postsQuery = query(postsCollectionRef, where("__name__", "in", highlightedPostIds));
  
          onSnapshot(postsQuery, (snapshot) => {
            const postData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setHighlightedPosts(postData);
          });
        } else {
          // No highlighted posts
          setHighlightedPosts([]);
        }
      } else {
        console.log("User document does not exist.");
      }
    } catch (error) {
      console.error("Error fetching highlighted posts:", error);
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
          await updateDoc(userRef, {
            highlightedPosts: arrayRemove(postId),
          });
          console.log("Post unhighlighted successfully!");
  
          setHighlightedPosts((prevHighlightedPosts) =>
            prevHighlightedPosts.filter((post) => post.id !== postId)
          );
        } else {
          await updateDoc(userRef, {
            highlightedPosts: arrayUnion(postId),
          });
          console.log("Post highlighted successfully!");
  
          const postRef = doc(firestore, "posts", postId);
          const postSnapshot = await getDoc(postRef);
          if (postSnapshot.exists()) {
            const postData = { id: postSnapshot.id, ...postSnapshot.data() };
            setHighlightedPosts((prevHighlightedPosts) => [
              ...prevHighlightedPosts,
              postData,
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
    setEditedBio(bio); // Set the editedBio state to the current bio
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

  const handleSaveClick = () => {
    updateBio();
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
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

  const handleTextAreaClick = () => {
    if (bio === "Tell the community about yourself...") {
      setEditedBio("");
    }
  };

  const handleFileChange = (e) => {
    handleUpload(e.target.files[0]);
  };

  const handleUpload = async (file) => {
    if (!file) return;

    const storageRef = ref(storage, `profilePics/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.error("Upload failed:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const oldProfilePic = profilePic;
        setProfilePic(downloadURL);

        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const userRef = doc(firestore, "users", userId);
        try {
          await updateDoc(userRef, {
            profilePic: downloadURL,
          });

          if (oldProfilePic) {
            const oldProfilePicRef = ref(storage, oldProfilePic);
            deleteObject(oldProfilePicRef).catch((error) => {
              console.error("Error deleting old profile picture:", error);
            });
          }
        } catch (error) {
          console.error("Error updating profile picture:", error);
        }
      }
    );
  };

  const renderBioSection = () => {
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
          <div className="acc__btn__container">
            <button className="btn edit__btn" onClick={handleEditClick}>
              Edit
            </button>
            <button onClick={handleLogout} className="logout-button btn">
              Log Out
            </button>
          </div>
        </div>
      );
    }
  };

  const renderHighlightButton = (post) => {
    const isHighlighted = highlightedPosts.includes(post.id);
    const starStyle = {
      cursor: "pointer",
      color: isHighlighted ? "yellow" : "grey"
    };

    if (userId === localStorage.getItem("userId")) {
      return (
        <span
          onClick={() => handleHighlightClick(post.id)}
          style={starStyle}
        >
          ★
        </span>
      );
    }
    return null;
  };

  return (
    <div className="account-container">
      <div className="top-half">
        <div className="profile-info">
          <label
            htmlFor="profilePicInput"
            className={isEditing ? "lower-opacity" : ""}
          >
            {profilePic ? (
              <div className="profile-pic-wrapper">
                <img src={profilePic} alt="Profile" />
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  className={`edit-icon ${isEditing ? "icon-is-editing" : ""}`}
                />
              </div>
            ) : (
              <div>Profile Picture</div>
            )}
          </label>
          <input
            id="profilePicInput"
            type="file"
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
            <h3>Following</h3>
            <p>10</p>
          </div>
        </div>
        {renderBioSection()}
      </div>
      <div className="main-content">
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
                <div key={post.id} className="post-item">
                  <img src={post.imageUrl} alt="Flyer" className="post-flyer" />
                  <div className="post-content">
                    <h4>{post.name}</h4>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                  </div>
                  {renderHighlightButton(post)}
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
                  <img src={post.imageUrl} alt="Flyer" className="post-flyer" />
                  <div className="post-content">
                    <h4>{post.name}</h4>
                    <h3>{post.title}</h3>
                    <p>{truncateText(post.text, 115)}</p>
                  </div>
                  {renderHighlightButton(post)}

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showModal && <AccPost closeModal={closeModal} post={selectedPost} />}
    </div>
  );
}

export default Account;
