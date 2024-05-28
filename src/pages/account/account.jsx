import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../../Firebase";
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
import "./account.css";
// import ACM_flyer from "../../assets/ACM_flyer.png";
// import ACM2 from "../../assets/ACM2.png";
// import ACM3 from "../../assets/ACM3.png";
// import ACM4 from "../../assets/ACM4.png";
// import ACM5 from "../../assets/ACM5.png";
import ACMH1 from "../../assets/ACMH1.png";
import ACMH2 from "../../assets/ACMH2.png";
import { useSearchParams } from "react-router-dom";


// import flyer from '/ACM-flyer.png';

function Account(
  // userId
) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [bio, setBio] = useState("Tell the community about yourself...");
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [showHighlighted, setShowHighlighted] = useState(false);
  const [userPosts, setUserPosts] = useState([]);


  useEffect(() => {
    fetchUserInfo();
    fetchUserPosts();
  }, );

  const [searchParams] = useSearchParams();
  console.log(searchParams.get('id'));

  let userId;

  if (searchParams.get('id') === '1111'){
     userId = localStorage.getItem("userId");
  }
  else{
    userId = searchParams.get('id')
  }
  
  const fetchUserInfo = async () => {
    // const userId = localStorage.getItem("userId");
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


    const fetchUserPosts = async () => {
    // const userId = localStorage.getItem("userId");
    if (!userId) return;

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
  
    const postRef = doc(firestore, `users/${userId}/posts`, postId);
    const highlightedPostsRef = collection(firestore, `users/${userId}/highlightedPosts`);
  
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
    const isProfileOwner = searchParams.get("id") === "1111";
    if (isEditing) {
      return (
        <div className="render__bio__container">
          <textarea
            value={editedBio}
            onChange={handleInputChange}
            rows="1"
            cols="30"
            className="bio__textArea"
          />
          <div className="bio__btn__container">
            <button className="btn save__btn" onClick={handleSaveClick}>Save</button>
            <button className="btn cancel__btn" onClick={handleCancelClick}>Cancel</button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
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

  const renderHighlightButton = (post) => {
    const isHighlighted = highlightedPosts.some(
      (highlightedPost) => highlightedPost.id === post.id
    );
    const starStyle = {
      cursor: "pointer",
      color: isHighlighted ? "#FFA500" : "grey", 
      fontSize: "24px", 
    };
  
    // Check if the user is allowed to highlight based on the search parameter
    if (searchParams.get("id") === "1111") {
      return (
        <span onClick={() => handleHighlightClick(post.id)} style={starStyle}>
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
            <h3>Following</h3>
            <p>10</p>
          </div>
        </div>
        {renderBioSection()}
      </div>
      <div className="main-content">
        <div className="posts-tabs">
          <button onClick={handleRegularClick} className={`header__btn__acc ${!showHighlighted ? "active" : ""}`}>Regular Posts</button>
          <button onClick={handleHighlightedClick} className={`header__btn__acc ${showHighlighted ? "active" : ""}`}>Highlighted Posts</button>
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
                  {renderHighlightButton(post)}
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
