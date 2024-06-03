// src/postUtils.js
import { doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore } from './Firebase';

export const deletePost = async (postId) => {
  try {
    const postRef = doc(firestore, 'posts', postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      console.log('Post does not exist.');
      return;
    }

    const postData = postDoc.data();
    const likedBy = postData.likedBy || [];

    // Delete the post document
    await deleteDoc(postRef);

    // Remove references to this post from the likedPosts array in user documents
    for (const userId of likedBy) {
      const userRef = doc(firestore, 'users', userId);
      await updateDoc(userRef, {
        likedPosts: arrayRemove(postId)
      });
    }

    console.log('Post and associated data deleted successfully.');
  } catch (error) {
    console.error('Error deleting post:', error);
  }
};
