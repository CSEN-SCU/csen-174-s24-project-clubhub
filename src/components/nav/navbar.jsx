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
          <Link to="/about">About</Link>
        </li>
        <li className="nav-item">
          <Link to="/contact">Contact</Link>
        </li>
        <li className="nav-item">
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
}

export default navbar;
