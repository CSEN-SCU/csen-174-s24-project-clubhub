

import { doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { firestore } from './Firebase';

/**
 * Like a post by incrementing the like count, adding the user's ID to the "likedBy" list,
 * and adding the post ID to the user's "likedPosts" list.
 */
export const likePost = async (postId, userId) => {
try {
  const postRef = doc(firestore, 'posts', postId);
  const userRef = doc(firestore, 'users', userId);
  
  // Increment the like count and add the user's ID to the "likedBy" array
  await updateDoc(postRef, {
    likes: increment(1),
    likedBy: arrayUnion(userId)
  });

  // Add the post ID to the user's "likedPosts" array
  await updateDoc(userRef, {
    likedPosts: arrayUnion(postId)
  });

  console.log('Liked post successfully.');
} catch (error) {
  console.error('Error liking post:', error);
}
};

/**
 * Unlike a post by decrementing the like count, removing the user's ID from the "likedBy" list,
 * and removing the post ID from the user's "likedPosts" list.
 */
export const unlikePost = async (postId, userId) => {
try {
  const postRef = doc(firestore, 'posts', postId);
  const userRef = doc(firestore, 'users', userId);
  
  // Decrement the like count and remove the user's ID from the "likedBy" array
  await updateDoc(postRef, {
    likes: increment(-1),
    likedBy: arrayRemove(userId)
  });

  // Remove the post ID from the user's "likedPosts" array
  await updateDoc(userRef, {
    likedPosts: arrayRemove(postId)
  });

  console.log('Unliked post successfully.');
} catch (error) {
  console.error('Error unliking post:', error);
}
};
