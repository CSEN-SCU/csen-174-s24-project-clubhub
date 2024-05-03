import React from "react";
import { useNavigate } from "react-router-dom";
import "./error.css";

function Error() {
  const navigate = useNavigate();
  return (
    <div className="error-container">
      <h1>Oops! Please sign in with a scu.edu email.</h1>
      <p>Please contact support if you believe that this is an error.</p>
      <button id="goback" onClick={() => navigate("/")}>Go back to the home page</button>
    </div>
  );
}

export default Error;
