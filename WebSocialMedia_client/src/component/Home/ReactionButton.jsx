import React, { useEffect, useState, useRef } from 'react';
import { reactToPost, removeReactionFromPost, fetchPostReactions } from '../../api/reactionApi';
import { createNotification } from '../../api/notificationsApi';

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
const currentUserId = Number(localStorage.getItem('userId'));
const ReactionButton = ({ postId, postAuthorId }) => {
  const [userReaction, setUserReaction] = useState(null); // Reaction của người dùng
  const [reactionCounts, setReactionCounts] = useState([]); // Số lượng từng loại reaction
  const [showReactionOptions, setShowReactionOptions] = useState(false); // Hiển thị menu reaction
  const hideMenuTimeout = useRef(null); 

  // Lấy dữ liệu reaction từ API
  useEffect(() => {
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

  const handleReaction = async (type) => {
    try {
      if (userReaction === type) {
        // Nếu click cùng reaction, xóa reaction
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
        // Thả hoặc đổi sang reaction mới
        await reactToPost(postId, type);
        setUserReaction(type);
        setReactionCounts((prevCounts) =>
          prevCounts.map((reaction) =>
            reaction.type === type
              ? { ...reaction, count: reaction.count + 1 }
              : reaction
          )
        );

        // Gửi thông báo cho chủ bài viết
        if (postAuthorId) {
          await createNotification(postAuthorId, 'LIKE', currentUserId);
        }
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    } finally {
      setShowReactionOptions(false); // Đóng menu reaction
    }
  };

  const handleMouseEnter = () => {
    clearTimeout(hideMenuTimeout.current);
    setShowReactionOptions(true);
  };

  const handleMouseLeaveWithDelay = () => {
    hideMenuTimeout.current = setTimeout(() => {
      setShowReactionOptions(false);
    }, 300);
  };

  // Tính tổng số reaction
  const totalReactions = reactionCounts.reduce((sum, reaction) => sum + reaction.count, 0);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeaveWithDelay}
    >
      {/* Hiển thị tổng số reaction */}
      <div className="text-center mb-1 cursor-pointer">
        {totalReactions > 0 && (
          <span
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
            onClick={() => setShowReactionOptions((prev) => !prev)}
          >
            {totalReactions} Reactions
          </span>
        )}
      </div>

      {/* Nút phản hồi chính */}
      <button
        className={`flex items-center gap-2 px-3 py-2 rounded-full transition border ${
          userReaction
            ? 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900'
            : 'border-gray-300 dark:border-gray-600'
        } hover:shadow-lg`}
        onClick={() => setShowReactionOptions((prev) => !prev)}
      >
        <img
          src={userReaction ? reactionIcons[userReaction] : defaultIcon}
          alt="Reaction"
          className="w-6 h-6"
        />
        {userReaction && (
          <span
            className={`text-sm font-medium ${
              userReaction
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {reactionText[userReaction]}
          </span>
        )}
      </button>

      {/* Danh sách các reaction */}
      {showReactionOptions && (
        <div className="absolute top-14 left-0 flex gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-2 z-50">
          {Object.entries(reactionIcons).map(([type, icon]) => (
            <button
              key={type}
              className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
              onClick={() => handleReaction(type)}
              style={{ width: '50px', height: '50px' }}
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
