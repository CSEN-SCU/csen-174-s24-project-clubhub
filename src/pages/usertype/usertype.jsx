import React from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { firestore } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import "./usertype.css";

function UserType() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleStudentClick = async () => {
    console.log("User is a student");
    const userRef = doc(firestore, "users", currentUser.uid);
    await updateDoc(userRef, { userType: "student" });
    navigate("/home");
  };

  const handleClubOwnerClick = async () => {
    console.log("User is a club owner");
    const userRef = doc(firestore, "users", currentUser.uid);
    await updateDoc(userRef, { userType: "club owner" });
    navigate("/home");
  };

  return (
    <div className="user-type-container">
      <div className="text-container">
        <h1>Who are you?</h1>
        <p id="option-text">
          Select whether you are a student or a club owner.
        </p>
      </div>
      <div className="option-container">
        <button className="btn user-type-button" onClick={handleStudentClick}>
          I'm a Student
        </button>
        <button className="btn user-type-button" onClick={handleClubOwnerClick}>
          I'm a Club Owner
        </button>
      </div>
    </div>
  );
}

export default UserType;
