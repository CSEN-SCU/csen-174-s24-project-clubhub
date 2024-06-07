import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore } from '../../Firebase';

export const likePost = async (postId, userId) => {
  try {
    console.log("likePost called with postId:", postId, "userId:", userId); 
    const postRef = doc(firestore, 'posts', postId);
    const userRef = doc(firestore, 'users', userId);
    
    await updateDoc(postRef, {
      likes: arrayUnion(userId) // Increment likes counter
    });

    await updateDoc(userRef, {
      likedPosts: arrayUnion(postId) // Add the postId to the user's likedPosts
    });

    console.log('Liked post successfully.');
  } catch (error) {
    console.error('Error liking post:', error);
    throw error; 
  }
};

export const unlikePost = async (postId, userId) => {
  try {
    console.log("unlikePost called with postId:", postId, "userId:", userId); 
    const postRef = doc(firestore, 'posts', postId);
    const userRef = doc(firestore, 'users', userId);

    await updateDoc(postRef, {
      likes: arrayRemove(userId) // Decrement the likes counter
    });

    await updateDoc(userRef, {
      likedPosts: arrayRemove(postId) // Remove the postId from the user's likedPosts
    });

    console.log('Unliked post successfully.');
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error; // Re-throw the error to handle it in the component
  }
};
