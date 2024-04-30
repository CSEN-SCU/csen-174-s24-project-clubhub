import React from 'react'
import "./post.css";
import Avatar from "../../assets/logo.png"

function post({
    displayName,
    text,
    image,
    avatar
}) {
  return (
    <div>
      <div className='post'>
        <div className="post__avatar">
          <img src={Avatar} alt="Avatar" />
        </div>
        <div className="post__body">
          <div className="post__header">
            <div className="post__headerText">
              <h3>
                Sydney Szeto
              </h3>
            </div>
            <div className="post__headerDesc">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
          </div>
          <img className="post__image" src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHZhNXNqcmszb2l6NnlicDBjN2JkeG51dTdzYTQ0MXB1ZWl6dnpvbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LHZyixOnHwDDy/giphy.gif" alt="" />
        </div>
      </div>
    </div>
  )
}

export default post