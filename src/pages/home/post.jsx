import React from 'react'
import "./post.css";
import Avatar from "../../assets/sculogo.png"

function post({
    displayName,
    text,
    image,
    // avatar
}) {
  return (
      <div className='post'>
        <div className="post__avatar">
          <img src={Avatar} alt="Avatar" />
        </div>
        <div className="post__body">
          <div className="post__header">
            <div className="post__headerText">
              <h3>
                {displayName}
              </h3>
            </div>
            <div className="post__headerDesc">
              <p>{text}</p>
            </div>
          </div>
          <img className="post__image" src={image} alt="" />
        </div>
      </div>
  )
}

export default post