import { doc, writeBatch, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore } from './Firebase';

export const likePost = async (postId, userId) => {
  try {
    const postRef = doc(firestore, 'posts', postId);
    const userRef = doc(firestore, 'users', userId);
    const batch = writeBatch(firestore);
    
    batch.update(postRef, {
      likes: increment(1),
      likedBy: arrayUnion(userId)
    });

    batch.update(userRef, {
      likedPosts: arrayUnion(postId)
    });

    await batch.commit();

    console.log('Liked post successfully.');
  } catch (error) {
    console.error('Error liking post:', error);
  }
};

export const unlikePost = async (postId, userId) => {
  try {
    const postRef = doc(firestore, 'posts', postId);
    const userRef = doc(firestore, 'users', userId);
    const batch = writeBatch(firestore);
    
    batch.update(postRef, {
      likes: increment(-1),
      likedBy: arrayRemove(userId)
    });

    batch.update(userRef, {
      likedPosts: arrayRemove(postId)
    });

    await batch.commit();

    console.log('Unliked post successfully.');
  } catch (error) {
    console.error('Error unliking post:', error);
  }
};
