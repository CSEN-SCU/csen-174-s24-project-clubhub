import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentSignInWithGoogle, clubSignInWithGoogle } from "../../Firebase";
import Slider from "react-slick";
import "./welcome.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function importAll(r) {
  let images = [];
  r.keys().map((item, index) => {
    images[index] = r(item);
  });
  return images;
}

const images = importAll(
  require.context("../../assets/logos", false, /\.(png|jpe?g|svg)$/)
);

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function Welcome() {
  const [shuffledImages, setShuffledImages] = useState([]);
  const navigate = useNavigate();
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 1.5,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 0,
    cssEase: "linear",
  };

  useEffect(() => {
    setShuffledImages(shuffle([...images]));
  }, []);

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
      <div className="slider-container">
        <Slider {...settings}>
          {shuffledImages.map((image, index) => (
            <div key={index} className="slideshow-wrapper">
              <img
                className="slideshow-image"
                src={image}
                alt={`logo-${index}`}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Welcome;
