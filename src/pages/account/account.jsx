import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../../Firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./account.css";
// import flyer from '/ACM-flyer.png';

function Account() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [bio, setBio] = useState("This is my bio.");
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
    setBio(editedBio); // Save the edited bio
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

  const renderBioSection = () => {
    if (isEditing) {
      return (
        <div>
          <textarea
            value={editedBio}
            onChange={handleInputChange}
            rows="4"
            cols="50"
          />
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </div>
      );
    } else {
      return (
        <div>
          <div>{bio}</div>
          <button onClick={handleEditClick}>Edit</button>
        </div>
      );
    }
  };

  

  const regularPosts = [
    {
      id: 1,
      title: "Regular Post 1",
      content: "This is the content of regular post 1.",
      flyerUrl: "ACM-flyer.png", 
    },
    {
      id: 2,
      title: "Regular Post 2",
      content: "This is the content of regular post 2.",
      flyerUrl: "ACM2.png", 
    },
    {
      id: 3,
      title: "Regular Post 3",
      content: "This is the content of regular post 3.",
      flyerUrl: "ACM3.png", 
    },
    {
      id: 4,
      title: "Regular Post 4",
      content: "This is the content of regular post 4.",
      flyerUrl: "ACM4.png", 
    },
    {
      id: 5,
      title: "Regular Post 5",
      content: "This is the content of regular post 5.",
      flyerUrl: "ACM5.png", 
    },
  ];

  // Hardcoded sample highlighted posts with flyer images
  const highlightedPosts = [
    {
      id: 1,
      title: "Highlighted Post 1",
      content: "This is the content of highlighted post 1.",
      flyerUrl: "ACMH1.png", 
    },
    {
      id: 2,
      title: "Highlighted Post 2",
      content: "This is the content of highlighted post 2.",
      flyerUrl: "ACMH2.png", 
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="account-container">
      <div className="top-half">
        <div className="profile-info">
          {profilePic && <img id="profile" src={profilePic} alt="Profile" />}
          <h1>Following</h1>
          <h2>10</h2>
        </div>
      </div>
      <div className="bottom-half">
        <div>
          <h1>{name}</h1>
          <h2>{email}</h2>
        </div>
        {renderBioSection()}
      </div>
      <div className="main-content">
        <div className="posts-tabs">
          <button onClick={handleRegularClick} className={!showHighlighted ? "active" : ""}>Regular Posts</button>
          <button onClick={handleHighlightedClick} className={showHighlighted ? "active" : ""}>Highlighted Posts</button>
        </div>
        <hr className="underline" />
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
      <footer>
    <button onClick={handleLogout} className="logout-button btn">
          Log Out
        </button>
    </footer>
    </div>
  );
}

export default Account;
