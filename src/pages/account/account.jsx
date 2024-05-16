import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore, storage } from "../../Firebase";
import { signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  orderBy,
  setDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import "./account.css";
import ACMH1 from "../../assets/ACMH1.png";
import ACMH2 from "../../assets/ACMH2.png";
import { useSearchParams } from "react-router-dom";
import FollowButton from "../../components/follow/FollowButton";

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
  const [characterCount, setCharacterCount] = useState(0);


  const [searchParams] = useSearchParams();
  console.log(searchParams.get("id"));

  let userId;

  useEffect(() => {
    fetchUserInfo();
    fetchUserPosts();
  }, [searchParams.get("id")]);

  if (searchParams.get("id") === "1111") {
    userId = localStorage.getItem("userId");
  } else {
    userId = searchParams.get("id");
  }

  const renderFollowButton = () => {
    if (userId !== localStorage.getItem("userId")) {
      return <FollowButton currentUserId={localStorage.getItem("userId")} targetUserId = {userId} />;
    }
    return null;
  };

  const fetchUserInfo = async () => {
    if (!userId) return;

    const userRef = doc(firestore, "users", userId);
    try {
      onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.name);
          setEmail(userData.email);
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

    const userPostsRef = collection(firestore, `users/${userId}/posts`);
    const q = query(userPostsRef, orderBy("timestamp", "desc"));
    try {
      onSnapshot(q, (snapshot) => {
        const postData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserPosts(postData);
      });
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };
  

  const handleHighlightClick = async (postId) => {
    const userId = localStorage.getItem("userId");
    if (!userId || !postId) return;

    const postRef = doc(firestore, `users/${userId}/posts`, postId);
    const highlightedPostsRef = collection(
      firestore,
      `users/${userId}/highlightedPosts`
    );

    try {
      const postSnapshot = await getDoc(postRef);
      if (postSnapshot.exists()) {
        const postData = postSnapshot.data();
        await setDoc(doc(highlightedPostsRef), postData);
        console.log("Post highlighted successfully!");
      } else {
        console.log("Post does not exist.");
      }
    } catch (error) {
      console.error("Error highlighting post:", error);
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

  const handleSaveClick = () => {
    if (editedBio.trim() === "") {
      setBio("Tell the community about yourself...");
    } else {
      setBio(editedBio);
    }
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

  const highlightedPosts = [
    {
      id: 1,
      title: "Highlighted Post 1",
      content: "This is the content of highlighted post 1.",
      flyerUrl: ACMH1,
    },
    {
      id: 2,
      title: "Highlighted Post 2",
      content: "This is the content of highlighted post 2.",
      flyerUrl: ACMH2,
    },
  ];

  return (
    <div className="account-container">
      <div className="top-half">
        <div className="profile-info">
          <label htmlFor="profilePicInput">
            {profilePic ? (
              <img src={profilePic} alt="Profile" />
            ) : (
              <div>Profile Picture</div>
            )}
          </label>
          <input
            id="profilePicInput"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      </div>
      <div className="bottom-half">
        <div className="bottom__half__container">
          <div className="nameEmailContainer">
            <h1>{name}</h1>
            <p>{email}</p>
          </div>
          <div className="following__container">
            <h3>Following</h3>
            <p>10</p>
          </div>
        </div>
        {renderBioSection()}
        {renderFollowButton()}
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
            <div>
              {highlightedPosts.map((post) => (
                <div key={post.id} className="post-item">
                  <img src={post.flyerUrl} alt="Flyer" className="post-flyer" />
                  <div className="post-content">
                    <h4>{post.title}</h4>
                    <p>{post.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {userPosts.map((post) => (
                <div key={post.id} className="post-item">
                  <img src={post.imageUrl} alt="Flyer" className="post-flyer" />
                  <div className="post-content">
                    <h4>{post.title}</h4>
                    <p>{post.text}</p>
                  </div>
                  <button onClick={() => handleHighlightClick(post.id)}>
                    Highlight Post
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Account;
