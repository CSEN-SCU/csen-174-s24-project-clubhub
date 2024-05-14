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
              <h2>{displayName}</h2>
            </Link>
            <p className="post__time">{formatDate(timestamp)}</p>
            {/* <p className='post__time'>Feb 12 • 3:00 pm</p> */}
            <h3>
                {title}
            </h3>
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
