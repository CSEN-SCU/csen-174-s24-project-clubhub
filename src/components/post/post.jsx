import React from "react";
import "./post.css";
import Avatar from "../../assets/sculogo.png";
import { Link } from "react-router-dom";

const formatDate = (timestamp) => {
  let date;
  if (timestamp?.toDate) {
    // Handle Firestore Timestamp objects
    date = timestamp.toDate();
  } else {
    date = new Date(timestamp);
  }

  // Formatting the date part
  const optionsDate = { month: "short", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", optionsDate);

  // Formatting the time part
  const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };
  const formattedTime = date.toLocaleTimeString("en-US", optionsTime);

  // Combining both parts
  return `${formattedDate} • ${formattedTime}`;
};

function post({
  displayName,
  timestamp,
  text,
  image,
  userID,
  title,
  // avatar
}) {
  return (
    <div className="post">
      <div className="post__avatar">
        <Link to={`/account?id=${userID}`}>
          <img src={Avatar} alt="Avatar" />
        </Link>
      </div>
      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <Link to={`/account?id=${userID}`}>
              <h3>{displayName}</h3>
            </Link>
            <p className="post__time">{formatDate(timestamp)}</p>
          </div>
          <h2 className="post__title">
                {title}
          </h2>
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
