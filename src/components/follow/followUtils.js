import { firestore } from '../../Firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

/**
 * Follow another user by adding their user ID to the current user's "following" list
 * and the current user's ID to the other user's "follower" list.
 */
export const followUser = async (currentUserId, targetUserId) => {
  try {
    // Add target user to the current user's "following" list
    const currentUserRef = doc(firestore, 'users', currentUserId);
    await updateDoc(currentUserRef, {
      following: arrayUnion(targetUserId),
    });

    // Add current user to the target user's "follower" list
    const targetUserRef = doc(firestore, 'users', targetUserId);
    await updateDoc(targetUserRef, {
      follower: arrayUnion(currentUserId),
    });

    console.log('Followed user successfully.');
  } catch (error) {
    console.error('Error following user:', error);
  }
};

/**
 * Unfollow another user by removing their user ID from the current user's "following" list
 * and the current user's ID from the other user's "follower" list.
 */
export const unfollowUser = async (currentUserId, targetUserId) => {
  try {
    // Remove target user from the current user's "following" list
    const currentUserRef = doc(firestore, 'users', currentUserId);
    await updateDoc(currentUserRef, {
      following: arrayRemove(targetUserId),
    });

    // Remove current user from the target user's "follower" list
    const targetUserRef = doc(firestore, 'users', targetUserId);
    await updateDoc(targetUserRef, {
      follower: arrayRemove(currentUserId),
    });

    console.log('Unfollowed user successfully.');
  } catch (error) {
    console.error('Error unfollowing user:', error);
  }
};
