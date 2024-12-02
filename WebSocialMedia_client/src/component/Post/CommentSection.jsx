import React, { useState } from 'react';

const CommentSection = ({
  latestComment,
  postId,
  loggedInUserId,
  totalComments,
  handleAddComment,
}) => {
  const [currentComment, setCurrentComment] = useState(latestComment); // State for the latest comment
  const [newComment, setNewComment] = useState(''); // State for the new comment input

  const handleAddAndReset = () => {
    if (!newComment.trim()) return;
    handleAddComment(postId, newComment); // Call the parent handler
    setCurrentComment({
      username: 'Bạn',
      content: newComment,
      userId: loggedInUserId,
    });
    setNewComment(''); // Clear the input
  };

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm">
      {/* Tổng số bình luận */}
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Tổng số bình luận: <span className="font-bold">{totalComments}</span>
      </p>

      {/* Bình luận mới nhất */}
      {currentComment && (
        <div className="mt-3 p-3 border rounded bg-white dark:bg-gray-700 shadow-sm">
          <p className="font-bold text-gray-800 dark:text-white">
            {currentComment.username || 'Người dùng ẩn danh'}
          </p>
          <p className="text-gray-700 dark:text-gray-300">{currentComment.content}</p>
        </div>
      )}

      {/* Nhập bình luận mới */}
      <div className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
          placeholder="Nhập bình luận..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddAndReset();
            }
          }}
        />
        <button
          onClick={handleAddAndReset}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
