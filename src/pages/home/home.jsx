import React, { useState, useEffect } from 'react';
import Post from "./post";
import "./home.css";
import { firestore } from '../../Firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // const postsCollection = firestore.collection('posts');
        const postsCollection = collection(firestore, 'posts');
        const q = query(postsCollection, orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const fetchedPosts = snapshot.docs.map(doc => doc.data());
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

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
      {posts.map((post, index) => (
        <Post
          key={index}
          displayName= {post.name}
          text= {post.text}
          image= {post.imageUrl}
          // avatar={post.avatar}
        />
      ))}
    </div>
  )
}

export default Home