import React, { useState, useEffect } from "react";
import Post from "../../components/post/post";
import "./home.css";
import { firestore } from "../../Firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = () => {
      const postsCollection = collection(firestore, "posts");
      const q = query(postsCollection, orderBy("timestamp", "desc"));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedPosts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPosts(fetchedPosts);
        },
        (error) => {
          console.error("Error fetching posts:", error);
        }
      );

      return () => unsubscribe();
    };

    fetchPosts();
  }, []);

  // State to track the active link
  const [activeLink, setActiveLink] = useState("explore");

  // Function to handle link click
  const handleLinkClick = (linkName) => {
    setActiveLink(linkName); // Update the active link in state
  };

  return (
    <div className="home">
      {/* Header */}
      <div className="home__header">
        <button
          className="header__button"
          onClick={() => handleLinkClick("explore")}
        >
          <h2>
            <a
              className={`home__link ${
                activeLink === "explore" ? "active" : ""
              }`}
            >
              Explore
            </a>
          </h2>
        </button>
        <button
          className="header__button"
          onClick={() => handleLinkClick("following")}
        >
          <h2>
            <a
              className={`home__link ${
                activeLink === "following" ? "active" : ""
              }`}
            >
              Following
            </a>
          </h2>
        </button>
      </div>

      {/* Post */}
      {posts.map((post) => (
        <Post
          key={post.id}
          displayName={post.name}
          timestamp={post.timestamp}
          text={post.text}
          image={post.imageUrl}
          userID={post.userID}
          title={post.title}
          // avatar={post.avatar}
        />
      ))}
    </div>
  );
}

export default Home;
