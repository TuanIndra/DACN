import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaBell,
  FaUserCircle,
  FaCog,
  FaArrowLeft,
  FaArrowRight,
  FaThumbsUp,
  FaShare,
} from 'react-icons/fa';
import { fetchCommentsByPostId, createComment, replyToComment } from '../../api/commentApi';

const PostDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const post = location.state?.post;
  const initialIndex = location.state?.currentImageIndex || 0;

  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [likes, setLikes] = useState(post?.reactions?.length || 0);
  const [liked, setLiked] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    if (post?.id) {
      fetchCommentsByPostId(post.id)
        .then((response) => {
          setComments(response.data);
          setLoadingComments(false);
        })
        .catch((error) => {
          console.error('Error fetching comments:', error);
          setLoadingComments(false);
        });
    }
  }, [post?.id]);

  const handleNextMedia = () => {
    if (post.mediaList && currentImageIndex < post.mediaList.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousMedia = () => {
    if (post.mediaList && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Ngăn chặn hành động mặc định nếu cần
      handleAddComment();
    }
  };
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
  
    if (replyingTo) {
      // Trả lời bình luận
      replyToComment(replyingTo, { content: newComment })
        .then((response) => {
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === replyingTo
                ? { ...comment, replies: [...(comment.replies || []), response.data] }
                : comment
            )
          );
          setReplyingTo(null);
          setNewComment('');
        })
        .catch((error) => {
          console.error('Error replying to comment:', error);
        });
    } else {
      // Thêm mới bình luận
      createComment(post.id, { content: newComment })
        .then((response) => {
          setComments((prevComments) => {
            // Kiểm tra cấu trúc của response.data
            const newCommentData = response.data;
            return [...prevComments, newCommentData];
          });
          setNewComment('');
        })
        .catch((error) => {
          console.error('Error creating comment:', error);
        });
    }
  };
  

  const handleLike = () => {
    setLiked(!liked);
    setLikes((prevLikes) => (liked ? prevLikes - 1 : prevLikes + 1));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isVideo = (url) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    return videoExtensions.some((ext) => url.endsWith(ext));
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Không tìm thấy bài viết.</p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded"
          onClick={() => navigate('/')}
        >
          Quay lại Trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-secondary dark:bg-gray-900">
      {/* Left section */}
      <div className="relative w-[70%] flex items-center justify-center bg-white dark:bg-gray-800 rounded-l-lg shadow-lg">
        <button
          className="absolute top-4 left-4 bg-gray-700 text-white rounded-full p-2 shadow hover:bg-gray-500"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </button>

        {currentImageIndex > 0 && (
          <button
            className="absolute left-2 z-10 bg-gray-700 text-white rounded-full p-2 shadow hover:bg-gray-500"
            onClick={handlePreviousMedia}
          >
            <FaArrowLeft size={24} />
          </button>
        )}

        <div className="w-full h-screen flex items-center justify-center">
          {isVideo(post.mediaList[currentImageIndex]?.url) ? (
            <video
              controls
              src={`http://localhost:8082/uploads/${post.mediaList[currentImageIndex]?.url}`}
              className="max-h-full w-auto object-contain rounded"
            />
          ) : (
            <img
              src={`http://localhost:8082/uploads/${post.mediaList[currentImageIndex]?.url}`}
              alt={`Media ${currentImageIndex + 1}`}
              className="max-h-full w-auto object-contain rounded"
            />
          )}
        </div>

        {currentImageIndex < post.mediaList.length - 1 && (
          <button
            className="absolute right-2 z-10 bg-gray-700 text-white rounded-full p-2 shadow hover:bg-gray-500"
            onClick={handleNextMedia}
          >
            <FaArrowRight size={24} />
          </button>
        )}
      </div>

      {/* Right section */}
      <div className="w-[30%] bg-white dark:bg-gray-700 p-4 shadow-lg rounded-r-lg flex flex-col">
        {/* Header */}
        <div className="flex justify-between mb-6">
          <button className="p-2 bg-primary text-white rounded-full shadow hover:bg-opacity-80">
            <FaBell size={24} />
          </button>
          <button className="p-2 bg-primary text-white rounded-full shadow hover:bg-opacity-80">
            <FaUserCircle size={24} />
          </button>
          <button className="p-2 bg-primary text-white rounded-full shadow hover:bg-opacity-80">
            <FaCog size={24} />
          </button>
        </div>

        {/* Post details */}
        <div className="flex-grow overflow-y-auto">
          <h3 className="text-2xl font-bold mb-4 dark:text-white">{post.user?.fullName || 'Người dùng'}</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-8">{post.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-4 mb-4 border-t border-b py-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded border ${
                liked ? 'text-primary border-primary' : 'text-gray-500 border-gray-300'
              }`}
            >
              <FaThumbsUp />
              <span>{likes}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded border border-gray-300 text-gray-500">
              <FaShare />
              <span>{post.shares?.length || 0}</span>
            </button>
          </div>

          {/* Comments */}
          <div className="mt-8">
            <h4 className="text-lg font-bold dark:text-white mb-4">Bình luận</h4>
            <div className="max-h-[400px] overflow-y-auto">
              <ul className="space-y-4">
                {comments.map((comment) => (
                  <li key={comment.id} className="p-2 bg-white dark:bg-gray-800 rounded shadow">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(comment.createdAt)}</p>
                    <p className="font-bold dark:text-primary">{comment.username || 'Người dùng ẩn danh'}</p>
                    <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                    <button
                      className="text-primary text-sm mt-2"
                      onClick={() => {
                        setReplyingTo(comment.id);
                        setNewComment('');
                      }}
                    >
                      Trả lời
                    </button>
                    {comment.replies?.length > 0 && (
                      <ul className="ml-4 mt-2 space-y-2">
                        {comment.replies.map((reply) => (
                          <li key={reply.id} className="p-2 bg-gray-200 dark:bg-gray-900 rounded shadow">
                            <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(reply.createdAt)}</p>
                            <p className="font-bold dark:text-primary">{reply.username || 'Người dùng ẩn danh'}</p>
                            <p className="text-gray-700 dark:text-gray-300">{reply.content}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Add new comment */}
        <div className="mt-4 flex">
        <input
  type="text"
  value={newComment}
  onChange={(e) => setNewComment(e.target.value)}
  onKeyDown={handleKeyDown} // Thêm dòng này
  className="flex-grow p-2 border rounded dark:bg-gray-800 dark:text-white"
  placeholder={replyingTo ? 'Trả lời...' : 'Thêm bình luận...'}
/>
          <button onClick={handleAddComment} className="ml-2 px-4 py-2 bg-primary text-white rounded">
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
