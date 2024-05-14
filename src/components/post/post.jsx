import React from "react";
import "./post.css";
import Avatar from "../../assets/sculogo.png";
import { Link } from "react-router-dom";

function post({
  displayName,
  text,
  image,
  userID,
  // avatar
}) {
  return (
    <div className="post">
      <div className="post__avatar">
        <Link to={`/profile/${userID}`}>
          <img src={Avatar} alt="Avatar" />
        </Link>
      </div>
      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3>{displayName}</h3>
          </div>
          <div className="post__headerDesc">
            <p>{text}</p>
          </div>
        </div>
        <img className="post__image" src={image} alt="" />
      </div>
    </div>
  );
}

export default post;
