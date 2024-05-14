import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./error.css";

function Error() {
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = location.state || {
    message: "An unknown error occurred.",
  };

  const goBack = () => {
    navigate("/");
  };

  return (
    <div className="error-container">
      <h1>Oops! {message}</h1>
      <p>Please contact support if you believe that this is an error.</p>
      <h3>scuclubhub@gmail.com</h3>
      <button className="btn" id="goback" onClick={goBack}>
        Return to home page
      </button>
    </div>
  );
}

export default Error;
