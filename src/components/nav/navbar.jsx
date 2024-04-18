// src/components/nav/navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./navbar.css";

function Navbar() {
  const { currentUser } = useAuth();

  return (
    <nav className="navbar">
      {currentUser ? (
        <ul>
          <li className="nav-item">
            <Link to="/home">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/search">Search</Link>
          </li>
          <li className="nav-item">
            <Link to="/clubs">All Clubs</Link>
          </li>
          <li className="nav-item">
            <Link to="/gpt">GPT</Link>
          </li>
          <li className="nav-item">
            <Link to="/account">Account</Link>
          </li>
        </ul>
      ) : (
        <div></div>
      )}
    </nav>
  );
}

export default Navbar;
