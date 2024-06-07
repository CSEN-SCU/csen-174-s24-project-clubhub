import React from "react";
import "./post.css";
import { Link } from "react-router-dom";
import LikeButton from "../likeButton/likeButton";

const formatDate = (timestamp) => {
  let date;
  if (timestamp?.toDate) {
    date = timestamp.toDate();
  } else {
    date = new Date(timestamp);
  }

  const optionsDate = { month: "short", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", optionsDate);

  const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };
  const formattedTime = date.toLocaleTimeString("en-US", optionsTime);

  return `${formattedDate} • ${formattedTime}`;
};

function Post({
  postId,
  displayName,
  timestamp,
  text,
  image,
  userID,
  title,
  avatar,
  likes,
  currentUserId = localStorage.getItem("userId"), // Ensure currentUserId prop is passed
}) {
  return (
    <div className="post">
      <div className="post__avatar">
        <Link to={`/account?id=${userID}`}>
          <img className="postAvatarPic" src={avatar} alt="Avatar" />
        </Link>
      </div>
      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <Link to={`/account?id=${userID}`}>
              <h2>{displayName}</h2>
            </Link>
            <p className="post__time">{formatDate(timestamp)}</p>
          </div>
          <h3 className="post__title">{title}</h3>
          <div className="post__headerDesc">
            <p>{text}</p>
          </div>
        </div>
        <img className="post__image" src={image} alt="" />
        <LikeButton
          postId={postId} // Ensure postId is passed
          initialLikes={likes}
          userId={currentUserId} // Ensure currentUserId is passed
        />
      </div>
    </div>
  );
}

export default Post;
