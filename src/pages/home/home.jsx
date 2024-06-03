import React, { useState, useEffect } from "react";
import Post from "../../components/post/post";
import "./home.css";
import { firestore } from "../../Firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  where,
  limit,
  startAfter,
} from "firebase/firestore";
import { auth } from "../../Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceFrown } from "@fortawesome/free-regular-svg-icons";

function Home() {
  const [posts, setPosts] = useState([]);
  const [activeLink, setActiveLink] = useState("explore");
  const [noFollowMessage, setNoFollowMessage] = useState("");
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const postsPerPage = 3;

  const fetchPosts = async (isInitialLoad = true) => {
    setLoading(true);
    const postsCollection = collection(firestore, "posts");
    let q;
    try {
      if (activeLink === "explore") {
        if (isInitialLoad) {
          q = query(
            postsCollection,
            orderBy("timestamp", "desc"),
            limit(postsPerPage)
          );
        } else {
          q = query(
            postsCollection,
            orderBy("timestamp", "desc"),
            startAfter(lastVisible),
            limit(postsPerPage)
          );
        }
      } else if (activeLink === "following") {
        const user = auth.currentUser;
        const userID = user.uid;
        const currentUserRef = doc(firestore, "users", userID);
        const currentUserDoc = await getDoc(currentUserRef);
        const following = currentUserDoc.data().following || [];

        if (following.length > 0) {
          if (isInitialLoad) {
            q = query(
              postsCollection,
              where("userID", "in", following),
              orderBy("timestamp", "desc"),
              limit(postsPerPage)
            );
          } else {
            q = query(
              postsCollection,
              where("userID", "in", following),
              orderBy("timestamp", "desc"),
              startAfter(lastVisible),
              limit(postsPerPage)
            );
          }
        } else {
          setNoFollowMessage(" You do not currently follow any clubs.");
          setPosts([]);
          setLoading(false);
          return;
        }
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedPosts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          if (fetchedPosts.length < postsPerPage) {
            setHasMorePosts(false); // No more posts to load
          } else {
            setHasMorePosts(true);
          }

          setPosts((prevPosts) =>
            isInitialLoad ? fetchedPosts : [...prevPosts, ...fetchedPosts]
          );
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
          setLoading(false);
          setNoFollowMessage("");
        },
        (error) => {
          console.error("Error fetching posts:", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeLink]);

  // Function to handle link click
  const handleLinkClick = (linkName) => {
    setActiveLink(linkName); // Update the active link in state
    setPosts([]); // Clear the posts array
    setLastVisible(null); // Reset the last visible document
  };

  // Function to load more posts when the user scrolls
  const handleLoadMore = () => {
    if (!loading) {
      fetchPosts(false);
    }
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
      {activeLink === "following" && noFollowMessage ? (
        <div className="no-follow-message">
          <FontAwesomeIcon icon={faFaceFrown} />
          {noFollowMessage}
        </div>
      ) : (
        posts.map((post) => (
          <Post
            key={post.id}
            displayName={post.name}
            timestamp={post.timestamp}
            text={post.text}
            image={post.imageUrl}
            userID={post.userID}
            title={post.title}
            avatar={post.avatar}
          />
        ))
      )}

      {/* Load More Button */}
      {posts.length > 0 && hasMorePosts && (
        <button
          className="load__more"
          onClick={handleLoadMore}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}

export default Home;
