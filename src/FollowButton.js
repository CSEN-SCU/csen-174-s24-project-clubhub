import React, { useEffect, useState } from 'react';
import { followUser, unfollowUser } from './followUtils';
import { firestore } from './Firebase.js';
import { doc, getDoc } from 'firebase/firestore';

const FollowButton = ({ currentUserId, targetUserId }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  // Determine if the current user is following the target user
  useEffect(() => {
    const checkIfFollowing = async () => {
      const currentUserRef = doc(firestore, 'users', currentUserId);
      const currentUserDoc = await getDoc(currentUserRef);

      if (currentUserDoc.exists()) {
        const { following } = currentUserDoc.data();
        setIsFollowing(following.includes(targetUserId));
      }
    };

    checkIfFollowing();
  }, [currentUserId, targetUserId]);

  const handleFollowToggle = async () => {
    if (isFollowing) {
      await unfollowUser(currentUserId, targetUserId);
    } else {
      await followUser(currentUserId, targetUserId);
    }

    setIsFollowing(!isFollowing);
  };

  return (
    <button onClick={handleFollowToggle}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
