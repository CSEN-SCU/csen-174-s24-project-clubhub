import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore, storage } from "../../Firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./account.css";
import ACM_flyer from "../../assets/ACM_flyer.png";
import ACM2 from "../../assets/ACM2.png";
import ACM3 from "../../assets/ACM3.png";
import ACM4 from "../../assets/ACM4.png";
import ACM5 from "../../assets/ACM5.png";
import ACMH1 from "../../assets/ACMH1.png";
import ACMH2 from "../../assets/ACMH2.png";

// import flyer from '/ACM-flyer.png';

function Account() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [bio, setBio] = useState("Tell the community about yourself...");
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [showHighlighted, setShowHighlighted] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const userRef = doc(firestore, "users", userId);
    try {
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setName(userData.name);
        setEmail(userData.email);
        setProfilePic(userData.profilePic || "");
      } else {
        console.log("No user data available");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setLoading(false);
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
    setEditedBio(e.target.value); // Update the edited bio as the user types
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
        setProfilePic(downloadURL);

        // Update the profilePic field in Firestore
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const userRef = doc(firestore, "users", userId);
        try {
          await updateDoc(userRef, {
            profilePic: downloadURL,
          });
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
          <div className="acc__btn__container">
            <button className="btn save__btn" onClick={handleSaveClick}>Save</button>
            <button className="btn cancel__btn" onClick={handleCancelClick}>Cancel</button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bio__option">
          <p className="bio__text">{bio}</p>
          <div className="acc__btn__container">
            <button className="btn edit__btn" onClick={handleEditClick}>Edit</button>
            <button onClick={handleLogout} className="logout-button btn">Log Out</button>
          </div>
        </div>
      );
    }
  };

  const regularPosts = [
    {
      id: 1,
      title: "Regular Post 1",
      content: "This is the content of regular post 1.",
      flyerUrl: ACM_flyer,
    },
    {
      id: 2,
      title: "Regular Post 2",
      content: "This is the content of regular post 2.",
      flyerUrl: ACM2,
    },
    {
      id: 3,
      title: "Regular Post 3",
      content: "This is the content of regular post 3.",
      flyerUrl: ACM3,
    },
    {
      id: 4,
      title: "Regular Post 4",
      content: "This is the content of regular post 4.",
      flyerUrl: ACM4,
    },
    {
      id: 5,
      title: "Regular Post 5",
      content: "This is the content of regular post 5.",
      flyerUrl: ACM5,
    },
  ];

  // Hardcoded sample highlighted posts with flyer images
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

  if (loading) {
    return <div>Loading...</div>;
  }

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
              {regularPosts.map((post) => (
                <div key={post.id} className="post-item">
                  <img src={post.flyerUrl} alt="Flyer" className="post-flyer" />
                  <div className="post-content">
                    <h4>{post.title}</h4>
                    <p>{post.content}</p>
                  </div>
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
