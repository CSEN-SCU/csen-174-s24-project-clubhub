import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../Firebase";
import Logo from "../../assets/logo.png";
import "./navbar.css";
import Post from "../../pages/posting/Post";

function Navbar() {
  const { currentUser } = useAuth();
  const [toggle, showMenu] = useState(false);
  const [userType, setUserType] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchUserType = async () => {
      if (currentUser) {
        const userRef = doc(firestore, "users", localStorage.getItem("userId"));
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserType(docSnap.data().userType);
        } else {
          console.log("No such document!");
        }
      }
    };


    fetchUserType();
  }, [currentUser]);

  const handleOpenModal = (item) => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <aside className={toggle ? "aside show-menu" : "aside"}>
        <Link to="/" className="nav__logo">
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
                  <Link to="/clubs" className="nav__link">
                    <i className="icon-magnifier"></i>
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
                {userType === "club owner" && (
                  <li className="nav__item">
                    <button 
                      className="nav__btn btn"
                      onClick={() => handleOpenModal()}
                    >+</button>
                  </li>
                )}
                {openModal && (
                  <Post closeModal={handleCloseModal} />
                )}
              </ul>
            ) : (
              <ul>
                <div className="group"></div>
              </ul>
            )}
          </div>
        </nav>
        <div className="nav__footer">
          <span className="copyright">&copy; 2024 ClubHub</span>
        </div>
      </aside>

      <div
        className={toggle ? "nav__toggle nav__toggle-open" : "nav__toggle"}
        onClick={() => showMenu(!toggle)}
      >
        <i className="icon-menu"></i>
      </div>
    </>
  );
}

export default Navbar;
