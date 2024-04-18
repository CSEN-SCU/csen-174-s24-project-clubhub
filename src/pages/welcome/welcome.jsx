// src/pages/welcome/welcome.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../../Firebase";
import "./welcome.css";

function Welcome() {
  const navigate = useNavigate();

  const handleSignIn = async () => {
    await signInWithGoogle();
    navigate("/");
  };

  return (
    <div className="container">
      <h1>Welcome to ClubHub!</h1>
      <button className="login-with-google-btn" onClick={handleSignIn}>
        Sign in with Google
      </button>
    </div>
  );
}

export default Welcome;
