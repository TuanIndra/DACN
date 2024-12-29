import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchCommentsByPostId, createComment, replyToComment } from '../../api/commentApi';
import ReactionButton from '../Home/ReactionButton';

const PostDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const post = location.state?.post;
  const initialIndex = location.state?.currentImageIndex || 0;

  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [loadingComments, setLoadingComments] = useState(true);
  const [likeCount, setLikeCount] = useState(post?.likeCount || 0);
  const [userHasLiked, setUserHasLiked] = useState(post?.hasLiked || false);

  useEffect(() => {
    if (post?.id) {
      fetchCommentsByPostId(post.id)
        .then((response) => setComments(response.data || []))
        .catch((error) => console.error('Error fetching comments:', error))
        .finally(() => setLoadingComments(false));
    }
  }, [post?.id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      let response;
      if (replyingTo) {
        response = await replyToComment(replyingTo, { content: newComment });
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === replyingTo
              ? { ...comment, replies: [...(comment.replies || []), response.data] }
              : comment
          )
        );
      } else {
        response = await createComment(post.id, { content: newComment });
        setComments((prev) => [response.data, ...prev]);
      }
      setNewComment('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error adding comment or reply:', error);
    }
  };

  const handleReplyToComment = (commentId) => {
    setReplyingTo(commentId);
    setNewComment('');
  };

  const handleReactionChange = (postId, newHasLiked, newLikeCount) => {
    setUserHasLiked(newHasLiked);
    setLikeCount(newLikeCount);
  };

  const handleNextMedia = () => {
    if (post.mediaList) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % post.mediaList.length);
    }
  };

  const handlePreviousMedia = () => {
    if (post.mediaList) {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex - 1 + post.mediaList.length) % post.mediaList.length
      );
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Không tìm thấy bài viết.</p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90"
          onClick={() => navigate('/')}
        >
          Quay lại Trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Media Section */}
      <div className="w-[65%] flex flex-col items-center justify-center bg-white dark:bg-gray-800 shadow-lg relative">
        {post.mediaList?.length > 0 && (
          <img
            src={`http://26.159.243.47:8082/uploads/${post.mediaList[currentImageIndex]?.url}`}
            alt="Post Media"
            className="max-h-full w-auto object-contain"
          />
        )}

        {/* Media Navigation */}
        {post.mediaList?.length > 1 && (
          <>
            <button
              onClick={handlePreviousMedia}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-3 py-1 rounded-full hover:bg-gray-600"
            >
              ←
            </button>
            <button
              onClick={handleNextMedia}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-3 py-1 rounded-full hover:bg-gray-600"
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Details Section */}
      <div className="w-[35%] bg-white dark:bg-gray-800 p-6 shadow-lg rounded-r-lg flex flex-col">
        <button
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 focus:ring-2 focus:ring-primary"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </button>

        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{post.user?.fullName || 'Người dùng'}</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{post.content}</p>

        {/* Reaction Button */}
        <div className="flex items-center gap-4 mb-6">
          <ReactionButton
            postId={post.id}
            hasLiked={userHasLiked}
            likeCount={likeCount}
            onReactionChange={handleReactionChange}
          />
        </div>

        {/* Comments Section */}
        <div className="flex-grow overflow-y-auto max-h-96">
  <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Bình luận</h4>
  {loadingComments ? (
    <p className="text-gray-500 dark:text-gray-400">Đang tải bình luận...</p>
  ) : (
    <div className="space-y-4">
      {comments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sắp xếp từ mới nhất đến cũ nhất
        .slice(0, 10) // Hiển thị tối đa 10 bình luận
        .map((comment) => (
          <div key={comment.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
            <p className="font-semibold dark:text-white">{comment.username || 'Người dùng ẩn danh'}</p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{comment.content}</p>
            <button
              onClick={() => handleReplyToComment(comment.id)}
              className="mt-2 text-blue-500 dark:text-blue-300 hover:underline"
            >
              Trả lời
            </button>

            {comment.replies?.length > 0 && (
              <div className="ml-4 mt-2 space-y-2">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="p-2 border rounded-lg bg-gray-100 dark:bg-gray-900">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(reply.createdAt).toLocaleString()}
                    </p>
                    <p className="font-semibold dark:text-primary">{reply.username || 'Người dùng ẩn danh'}</p>
                    <p className="mt-1 text-gray-700 dark:text-gray-300">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  )}
</div>


        {/* Add Comment Section */}
        <div className="mt-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white"
            placeholder={
              replyingTo ? 'Nhập trả lời của bạn...' : 'Nhập bình luận của bạn...'
            }
          />
          <button
            onClick={handleAddComment}
            className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 w-full"
          >
            {replyingTo ? 'Gửi trả lời' : 'Gửi bình luận'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
