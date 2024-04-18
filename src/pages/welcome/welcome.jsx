// src/pages/welcome/welcome.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../../Firebase";
import Logo from '../../assets/logo.png';
import "./welcome.css";

function Welcome() {
  const navigate = useNavigate();

  const handleSignIn = async () => {
    await signInWithGoogle();
    navigate("/");
  };

  return (
    <div className="welcome-container">
      <div className="left-container">
        <h1>Find your favorite Clubs!</h1>
        <p>
          FOR SCU students and organizations WHO need a centralized way to
          find/advertise club events ClubHub is a website THAT posts fliers,
          descriptions, locations and times of weekly club general meetings all
          in one location as well as features a GPT function that recommends
          clubs based off of student preferences
        </p>
        <button className="login-with-google-btn" onClick={handleSignIn}>
          Sign In with Google
        </button>
      </div>
      <div className="right-container">
        <img src={Logo} alt="logo"/>
      </div>
    </div>
  );
}

export default Welcome;
