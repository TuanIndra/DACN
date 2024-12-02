import React, { useEffect, useState } from 'react';
import { reactToPost, removeReactionFromPost, fetchPostReactions } from '../../api/reactionApi';
import likedIcon from '../../assets/like.jpg'; // Replace with your icon path
import unlikedIcon from '../../assets/unlike.jpg'; // Replace with an "unliked" icon if needed

const ReactionButton = ({ postId }) => {
  const [userReaction, setUserReaction] = useState(null); // User's current reaction
  const [reactionCounts, setReactionCounts] = useState([]); // Array of reaction counts

  useEffect(() => {
    // Fetch reactions and user's reaction when the component mounts
    const fetchReactions = async () => {
      try {
        const response = await fetchPostReactions(postId);
        setReactionCounts(response.data.reactions || []);
        setUserReaction(response.data.userReaction || null);
      } catch (error) {
        console.error('Error fetching reactions:', error);
      }
    };
    fetchReactions();
  }, [postId]);

  const handleReactionToggle = async () => {
    try {
      if (userReaction) {
        // Remove the reaction if user already reacted
        await removeReactionFromPost(postId);
        setUserReaction(null);
        setReactionCounts((prevCounts) =>
          prevCounts.map((reaction) =>
            reaction.type === userReaction
              ? { ...reaction, count: reaction.count - 1 }
              : reaction
          )
        );
      } else {
        // Add a "LIKE" reaction if no reaction yet
        await reactToPost(postId, 'LIKE');
        setUserReaction('LIKE');
        setReactionCounts((prevCounts) =>
          prevCounts.map((reaction) =>
            reaction.type === 'LIKE'
              ? { ...reaction, count: reaction.count + 1 }
              : reaction
          )
        );
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  // Calculate total reactions
  const totalReactions = reactionCounts.reduce((sum, reaction) => sum + reaction.count, 0);

  return (
    <button
      className={`flex items-center gap-2 px-3 py-2 rounded-full transition border ${
        userReaction
          ? 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900'
          : 'border-gray-300 dark:border-gray-600'
      } hover:shadow-lg`}
      onClick={handleReactionToggle}
    >
      <img
        src={userReaction ? likedIcon : unlikedIcon} // Dynamically switch icons
        alt="Like"
        className="w-6 h-6"
      />
      <span
        className={`text-sm font-medium ${
          userReaction ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {totalReactions > 0 ? totalReactions : 'Thích'}
      </span>
    </button>
  );
};

export default ReactionButton;
