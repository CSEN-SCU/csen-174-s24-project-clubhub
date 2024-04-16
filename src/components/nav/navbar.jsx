import React from "react";
import "./navbar.css";

function navbar() {
  return (
    <nav>
      <ul>
        <li className="nav-item">
          <a href="/">Home</a>
        </li>
        <li className="nav-item">
          <a href="/search">Search</a>
        </li>
        <li className="nav-item">
          <a href="/allclubs">All Clubs</a>
        </li>
        <li className="nav-item">
          <a href="/account">Account</a>
        </li>
        <li className="nav-item">
          <a href="/login">Login</a>
        </li>
      </ul>
    </nav>
  );
}

export default navbar;
