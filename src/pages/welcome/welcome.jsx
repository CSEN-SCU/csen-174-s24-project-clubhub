import React from "react";
import { studentSignInWithGoogle, clubSignInWithGoogle } from "../../Firebase";
import Logo from "../../assets/logo.png";
import "./welcome.css";

function Welcome() {

  return (
    <div className="welcome-container">
      <div className="left-container">
        <h1>Find your favorite Clubs!</h1>
        <p id="desc">
          FOR SCU students and organizations WHO need a centralized way to
          find/advertise club events ClubHub is a website THAT posts fliers,
          descriptions, locations and times of weekly club general meetings all
          in one location as well as features a GPT function that recommends
          clubs based off of student preferences
        </p>
        <div className="login-container">
          <button
            className="student login-with-google-btn"
            onClick={studentSignInWithGoogle}
          >
            Student Login
          </button>
          <button className="club login-with-google-btn" onClick={clubSignInWithGoogle}>
            Club Login
          </button>
        </div>
      </div>
      <div className="right-container">
        <img id="logo" src={Logo} alt="logo" />
      </div>
    </div>
  );
}

export default Welcome;
