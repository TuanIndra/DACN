import React, { useEffect, useState, useRef  } from 'react';
import { reactToPost, removeReactionFromPost, fetchPostReactions } from '../../api/reactionApi';

import likeIcon from '../../assets/like.jpg';
import loveIcon from '../../assets/love.png';
import hahaIcon from '../../assets/haha.jpg';
import wowIcon from '../../assets/wow.jpg';
import sadIcon from '../../assets/unlike.jpg';
import angryIcon from '../../assets/angry.jpg';
import defaultIcon from '../../assets/defaultIcon.png';


const reactionIcons = {
  LIKE: likeIcon,
  LOVE: loveIcon,
  HAHA: hahaIcon,
  WOW: wowIcon,
  SAD: sadIcon,
  ANGRY: angryIcon,
};

const reactionText = {
  LIKE: 'Thích',
  LOVE: 'Yêu thích',
  HAHA: 'Haha',
  WOW: 'Wow',
  SAD: 'Buồn',
  ANGRY: 'Giận dữ',
};

const ReactionButton = ({ postId }) => {
  const [userReaction, setUserReaction] = useState(null); // User's current reaction
  const [reactionCounts, setReactionCounts] = useState([]); // Array of reaction counts
  const [showReactionOptions, setShowReactionOptions] = useState(false); // Control reaction menu
  const hideMenuTimeout = useRef(null); 

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const response = await fetchPostReactions(postId); // API call
        setReactionCounts(response.data.reactions || []);
        setUserReaction(response.data.userReaction || null); // Set user's reaction
      } catch (error) {
        console.error('Error fetching reactions:', error);
      }
    };
    fetchReactions();
  }, [postId]);

  const handleReaction = async (type) => {
    try {
      if (userReaction === type) {
        // Remove reaction if same type clicked
        await removeReactionFromPost(postId);
        setUserReaction(null);
        setReactionCounts((prevCounts) =>
          prevCounts.map((reaction) =>
            reaction.type === type
              ? { ...reaction, count: reaction.count - 1 }
              : reaction
          )
        );
      } else {
        // Add or change reaction
        await reactToPost(postId, type);
        setUserReaction(type);
        setReactionCounts((prevCounts) =>
          prevCounts.map((reaction) =>
            reaction.type === type
              ? { ...reaction, count: reaction.count + 1 }
              : reaction
          )
        );
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    } finally {
      setShowReactionOptions(false); // Close reaction menu
    }
  };

  const handleMouseEnter = () => {
    // Clear timeout if mouse re-enters before timeout
    clearTimeout(hideMenuTimeout.current);
    setShowReactionOptions(true);
  };

  const handleMouseLeaveWithDelay = () => {
    setTimeout(() => {
      setShowReactionDetails(false); 
      setShowReactionOptions(false);
    }, 300); // Thời gian trễ (1 giây)
  };
  
  

  // Calculate total reactions
  const totalReactions = reactionCounts.reduce((sum, reaction) => sum + reaction.count, 0);
  const [showReactionDetails, setShowReactionDetails] = useState(false);

  return (
    <div className="relative"  
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeaveWithDelay} >
      {/* Tổng số reaction */}
      <div className="text-center mb-1 cursor-pointer">
        {totalReactions > 0 && (
          <span
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
            onClick={() => setShowReactionDetails((prev) => !prev)}
          >
            {totalReactions} reactions
          </span>
        )}
      </div>

      {/* Danh sách chi tiết reaction */}
      {showReactionDetails && (
        <div className="absolute top-10 left-0 flex gap-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 z-50">
          {reactionCounts.map(({ type, count }) => (
            <div key={type} className="flex flex-col items-center">
              <img src={reactionIcons[type]} alt={type} className="w-8 h-8" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{type}</span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{count}</span>
            </div>
          ))}
        </div>
      )}

      <button
        className={`flex items-center gap-2 px-3 py-2 rounded-full transition border ${
          userReaction
            ? 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900'
            : 'border-gray-300 dark:border-gray-600'
        } hover:shadow-lg`}
        onClick={async () => {
          if (userReaction) {
            // Xóa reaction nếu đã thả
            try {
              await removeReactionFromPost(postId); // Gọi API xóa reaction
              setUserReaction(null); // Cập nhật trạng thái
              setReactionCounts((prevCounts) =>
                prevCounts.map((reaction) =>
                  reaction.type === userReaction
                    ? { ...reaction, count: reaction.count - 1 }
                    : reaction
                )
              );
            } catch (error) {
              console.error('Error removing reaction:', error);
            }
          } else {
            // Hiển thị menu nếu chưa thả reaction
            setShowReactionOptions((prev) => !prev);
          }
        }}
      >
        <img
          src={userReaction ? reactionIcons[userReaction] : defaultIcon}
          alt="Reaction"
          className="w-6 h-6"
        />
        {userReaction && (
          <span
            className={`text-sm font-medium ${
              userReaction ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {reactionText[userReaction]}
          </span>
        )}
      </button>



      {/* Reaction options */}
      {showReactionOptions && (
        <div className="absolute top-14 left-0 flex gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-2 z-50">
        {Object.entries(reactionIcons).map(([type, icon]) => (
          <button
            key={type}
            className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
            onClick={() => handleReaction(type)}
            style={{ width: '50px', height: '50px' }} // Kích thước ô chứa ảnh
          >
            <img src={icon} alt={type} className="w-8 h-8 object-contain" />
          </button>
        ))}
      </div>
      )}
    </div>
  );
};

export default ReactionButton;
