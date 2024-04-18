import React, { useState, useEffect } from "react";
import "./login.css";
import { signInWithGoogle, firestore } from "../../Firebase";
import { doc, getDoc } from "firebase/firestore";

function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("");

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

  const signOut = () => {
    localStorage.removeItem("userId");
    window.location.reload();
  };

  return (
    <div className="container">
      {!localStorage.getItem("userId") && (
        <button className="login-with-google-btn" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      )}
      <h1>{name}</h1>
      <h1>{email}</h1>
      {profilePic && <img src={profilePic} alt="Profile" />}
      {localStorage.getItem("userId") && (
        <button onClick={signOut}>Sign out</button>
      )}
    </div>
  );
}

export default Login;
