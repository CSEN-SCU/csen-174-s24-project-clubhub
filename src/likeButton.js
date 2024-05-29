import React, { useEffect, useState } from 'react';
import { likePost, unlikePost } from './likeUtils';

const LikeButton = ({ postId, initialLikes, initialLikedBy, userId }) => {
const [isLiked, setIsLiked] = useState(false);
const [likeCount, setLikeCount] = useState(Number(initialLikes)); 

// Determine if the current user has liked the post
useEffect(() => {
if (userId) {
setIsLiked(initialLikedBy.includes(userId));
}
}, [initialLikedBy, userId]);

const handleLikeToggle = async () => {
if (isLiked) {
await unlikePost(postId, userId);
setLikeCount((prevCount) => prevCount - 1); // Decrement like count
} else {
await likePost(postId, userId);
setLikeCount((prevCount) => prevCount + 1); // Increment like count
}
setIsLiked(!isLiked);
};

return (
<button onClick={handleLikeToggle}>
{isLiked ? 'Unlike' : 'Like'} ({likeCount})
</button>
);
};

export default LikeButton;
