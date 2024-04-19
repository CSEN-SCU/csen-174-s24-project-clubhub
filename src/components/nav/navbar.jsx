// src/components/nav/navbar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../assets/logo.png"
import "./navbar.css";

function Navbar() {
  const { currentUser } = useAuth();
  const [toggle, showMenu] = useState(false);
  return (
    <>
      <aside className={toggle ? "aside show-menu" : "aside"}>
        <Link to="/home" className="nav__logo">
          <img src={Logo} alt="Home" />
        </Link>
        <nav className="nav">
          <div className="nav__menu">
            {currentUser ? (
            <ul className="nav__list">
              <li className="nav__item">
                <Link to="/home" className="nav__link">
                  <i className="icon-home"></i>
                </Link>
              </li>
              <li className="nav__item">
                <Link to="/search" className="nav__link">
                  <i className="icon-magnifier"></i>
                </Link>
              </li>
              <li className="nav__item">
                <Link to="/allclubs" className="nav__link">
                  <i className="icon-layers"></i>
                </Link>
              </li>
              <li className="nav__item">
                <Link to="/gpt" className="nav__link">
                  <i className="icon-bubble"></i>
                </Link>
              </li>
              <li className="nav__item">
                <Link to="/account" className="nav__link">
                  <i className="icon-user"></i>
                </Link>
              </li>
            </ul>
          ) : (
            <ul>
              <div className="group">
              </div>
            </ul>
          )}
          </div>
      </nav>
      <div className="nav__footer">
        <span className="copyright">&copy; 2024 ClubHub</span>
      </div>
      </aside>

      <div className={toggle ? "nav__toggle nav__toggle-open" : "nav__toggle"} onClick={() => showMenu(!toggle)}>
      <i className="icon-menu"></i>
    </div>
      </>
  );
}

export default Navbar;