import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import "./likeButton.css";
import { likePost, unlikePost } from "./likeUtils"; // Adjust the import path as necessary
import { firestore } from "../../Firebase";
import { doc, getDoc } from "firebase/firestore";

const LikeButton = ({ postId, userId }) => {
  const [likes, setLikes] = useState(0); // Initialize likes as 0
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRef = doc(firestore, "posts", postId);
        const postDoc = await getDoc(postRef);
        const postLikes = postDoc.data().likes || [];
        setLikes(postLikes.length); // Set likes to the length of the likes array
        const userRef = doc(firestore, 'users', userId);
        const userDoc = await getDoc(userRef);
        const likedPosts = userDoc.data().likedPosts || [];
        setLiked(likedPosts.includes(postId));
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchData();
  }, [postId, userId]);

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikePost(postId, userId);
        setLikes((prevLikes) => prevLikes - 1);
        setLiked(false);
      } else {
        await likePost(postId, userId);
        setLikes((prevLikes) => prevLikes + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  return (
    <button onClick={handleLike} className={`like-button ${liked ? "liked" : ""}`}>
      <FontAwesomeIcon icon={faThumbsUp} />
      {likes}
    </button>
  );
};

export default LikeButton;
