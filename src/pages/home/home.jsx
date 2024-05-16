import React, { useState, useEffect } from "react";
import Post from "../../components/post/post";
import "./home.css";
import { firestore } from "../../Firebase";
import { collection, query, orderBy, onSnapshot, doc, getDoc, where, getDocs } from "firebase/firestore";
import { auth } from "../../Firebase";

function Home() {
  const [posts, setPosts] = useState([]);
  const [activeLink, setActiveLink] = useState("explore");
  
  useEffect(() => {

    const fetchPosts = async() => {
      const postsCollection = collection(firestore, "posts");
      let q;
      try {
        if(activeLink == "explore"){
          q = query(postsCollection, orderBy("timestamp", "desc"));
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
        }
        else if(activeLink == "following"){
          const user = auth.currentUser;
          const userID = user.uid;
          const currentUserRef = doc(firestore, 'users', userID);
          const currentUserDoc = await getDoc(currentUserRef);
          const following = currentUserDoc.data().following || [];
          if (following.length > 0) { // Check if 'following' array is not empty
            q = query(postsCollection, where('userID', 'in', following), orderBy('timestamp', 'desc'));
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
                console.error("Error fetching posts !!!:", error);
              }
            );
      
            return () => unsubscribe();
          } else {
            // Handle case where 'following' array is empty
            console.log("No users followed.");
            setPosts([]); // Set posts to empty array
          }
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      // const q = query(postsCollection, orderBy("timestamp", "desc"));
    };

    fetchPosts();
  }, [activeLink]);

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
