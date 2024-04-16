import React from "react";
import "./navbar.css";
import { Link } from "react-router-dom";

function navbar() {
  return (
    <nav>
      <ul>
        <li className="nav-item">
          <Link to="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/search">Search</Link>
        </li>
        <li className="nav-item">
          <Link to="/allclubs">All Clubs</Link>
        </li>
        <li className="nav-item">
          <Link to="/gpt">GPT</Link>
        </li>
        <li className="nav-item">
          <Link to="/account">Account</Link>
        </li>
        <li className="nav-item">
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
}

export default navbar;
