import React, { useState, useEffect } from 'react';
import {
  fetchCommentsByPostId,
  createComment,
} from '../../api/commentApi';

const CommentSection = ({ postId, loggedInUserId }) => {
  const [latestComment, setLatestComment] = useState(null); // State for the latest comment
  const [newComment, setNewComment] = useState(''); // State for new comment input
  const [totalComments, setTotalComments] = useState(0); // Total comments count
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch only the latest comment from the API
  useEffect(() => {
    const fetchLatestComment = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchCommentsByPostId(postId);
        if (response.data.length > 0) {
          setLatestComment(response.data[0]); // Set the most recent comment
        }
        setTotalComments(response.data.length); // Update the total comments count
      } catch (err) {
        setError('Không thể tải bình luận. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestComment();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const newCommentObj = {
        content: newComment,
        userId: loggedInUserId,
      };

      const response = await createComment(postId, newCommentObj);
      setLatestComment(response.data); // Update the latest comment
      setTotalComments((prev) => prev + 1); // Increment the total comments count
      setNewComment(''); // Reset input
    } catch (err) {
      console.error('Error creating comment:', err);
      setError('Không thể thêm bình luận. Vui lòng thử lại.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddComment();
    }
  };

  if (loading) return <p>Đang tải bình luận...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm">
      {/* Total comments */}
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Tổng số bình luận: <span className="font-bold">{totalComments}</span>
      </p>

      {/* Latest comment */}
      {latestComment && (
        <div className="mt-4 p-3 border rounded bg-white dark:bg-gray-700 shadow-sm">
          <p className="font-bold text-gray-800 dark:text-white">
            {latestComment.username || 'Người dùng ẩn danh'}
          </p>
          <p className="text-gray-700 dark:text-gray-300">{latestComment.content}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(latestComment.createdAt).toLocaleString()}
          </p>
        </div>
      )}

      {/* Input new comment */}
      <div className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
          placeholder="Nhập bình luận..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleAddComment}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
