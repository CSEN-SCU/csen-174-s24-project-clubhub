import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../../Firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./account.css";

function Account() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      localStorage.removeItem("userId");
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const userRef = doc(firestore, "users", userId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setName(userData.name);
        setEmail(userData.email);
        setProfilePic(userData.profilePic || "");
      } else {
        console.log("No user data available");
      }
    };

    fetchUserInfo();
  }, []);
  return (
    <div className="account-container">
      <h1>{name}</h1>
      <h1>{email}</h1>
      {profilePic && <img id="profile" src={profilePic} alt="Profile" />}
      <button onClick={handleLogout} className="logout-button btn">
        Log Out
      </button>
    </div>
  );
}

export default Account;
