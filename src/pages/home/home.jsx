import React, { useState } from 'react';
import "./home.css";

function Home() {

  // State to track the active link
  const [activeLink, setActiveLink] = useState('explore');

  // Function to handle link click
  const handleLinkClick = (linkName) => {
    setActiveLink(linkName); // Update the active link in state
  };


  return (
    <div className="home">
      {/* Header */}
      <div className="home__header">
        <button className='header__button' onClick={() => handleLinkClick('explore')}>
          <h2>
            <a className={`home__link ${activeLink === 'explore' ? 'active' : ''}`}>
              Explore
            </a>
          </h2>
        </button>
        <button className='header__button' onClick={() => handleLinkClick('following')}>
          <h2>
            <a className={`home__link ${activeLink === 'following' ? 'active' : ''}`}>
              Following
            </a>
          </h2>
        </button>
      </div>

      {/* Post */}
      {/* Post */}
      {/* Post */}
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
      <h3>hello</h3>
    </div>
  )
}

export default Home