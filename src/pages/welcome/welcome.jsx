import React from "react";
import { useNavigate } from "react-router-dom";
import { studentSignInWithGoogle, clubSignInWithGoogle } from "../../Firebase";
import SCULogo from "../../assets/sculogo.png";
import Slider from "react-slick";
import "./welcome.css";

function Welcome() {
  const navigate = useNavigate();

  const handleStudentLogin = async () => {
    localStorage.setItem("userType", "student");
    try {
      await studentSignInWithGoogle();
      if (localStorage.getItem("hadError") === "club") {
        localStorage.removeItem("hadError");
        window.location.href = "/home";
      }
    } catch (error) {
      localStorage.setItem("hadError", "student");
      if (error.message === "SCU_EMAIL_REQUIRED") {
        navigate("/error", {
          state: { message: "Please sign in with a scu.edu email." },
        });
      }
    }
  };

  const handleClubLogin = async () => {
    localStorage.setItem("userType", "club owner");
    try {
      await clubSignInWithGoogle();
      if (localStorage.getItem("hadError") === "student") {
        localStorage.removeItem("hadError");
        window.location.href = "/home";
      }
    } catch (error) {
      localStorage.setItem("hadError", "club");
      if (error.message === "NOT_A_CLUB_OWNER") {
        navigate("/error", {
          state: { message: "Your email is not associated with a club." },
        });
      }
    }
  };

  return (
    <div className="welcome-container">
      <div className="left-container">
        <h1>Find your favorite clubs!</h1>
        <p id="desc">
          FOR SCU students and organizations WHO need a centralized way to
          find/advertise club events ClubHub is a website THAT posts fliers,
          descriptions, locations and times of weekly club general meetings all
          in one location as well as features a GPT function that recommends
          clubs based off of student preferences
        </p>
        <div className="login-container">
          <button
            className="student login-with-google-btn btn"
            onClick={handleStudentLogin}
          >
            Student Login
          </button>
          <button
            className="club login-with-google-btn btn"
            onClick={handleClubLogin}
          >
            Club Login
          </button>
        </div>
      </div>
      <div className="right-container">
        <img id="logo" src={SCULogo} alt="logo" />
      </div>
    </div>
  );
}

export default Welcome;
