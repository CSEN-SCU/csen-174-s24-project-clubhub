import React from "react";
import "./login.css";
import { signInWithGoogle } from "../../Firebase"


function login() {
  return (
    <div>
      <button className="login-with-google-btn" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <h1>{localStorage.getItem("name")}</h1>
      <h1>{localStorage.getItem("email")}</h1>
      <img src={localStorage.getItem("profilePic")} alt="profile" />
    </div>
  );
}

export default login;
