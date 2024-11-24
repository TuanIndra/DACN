import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../../api/postApi';
import { fetchCommentsByPostId, createComment } from '../../api/commentApi'; // API để lấy và tạo bình luận
import { useNavigate } from 'react-router-dom';

const PostsList = ({ onPostClick, userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetchPosts();
        let sortedPosts = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Lọc bài đăng theo `userId` nếu có
        if (userId) {
          sortedPosts = sortedPosts.filter((post) => post.user?.id === userId);
        }

        // Lấy tất cả bình luận và tính tổng số bình luận cho từng bài viết
        const postsWithComments = await Promise.all(
          sortedPosts.map(async (post) => {
            try {
              const commentsResponse = await fetchCommentsByPostId(post.id);
              const comments = commentsResponse.data || []; // Tất cả bình luận
              const totalComments = comments.reduce(
                (count, comment) => count + 1 + (comment.replies?.length || 0),
                0
              ); // Đếm bình luận và trả lời
              const latestComment = comments[0]; // Lấy bình luận mới nhất
              return { ...post, latestComment, totalComments };
            } catch (error) {
              console.error(`Error fetching comments for post ${post.id}:`, error);
              return { ...post, latestComment: null, totalComments: 0 }; // Đặt mặc định
            }
          })
        );

        setPosts(postsWithComments);
      } catch (err) {
        setError('Không thể tải danh sách bài viết');
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [userId]);

  const handleAddComment = async (postId, content) => {
    if (!content.trim()) return;

    try {
      const response = await createComment(postId, { content });
      const newComment = response.data;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, latestComment: newComment, totalComments: post.totalComments + 1 }
            : post
        )
      );
    } catch (error) {
      console.error(`Error adding comment to post ${postId}:`, error);
    }
  };

  const isVideo = (url) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    return videoExtensions.some((ext) => url.endsWith(ext));
  };

  if (loading) return <p className="dark:text-white">Đang tải...</p>;
  if (error) return <p className="dark:text-red-400">{error}</p>;

  return (
    <div>
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white dark:bg-gray-800 shadow-md rounded p-4 mb-4"
        >
          {/* Thông tin người dùng */}
          <div className="flex items-center mb-2">
            <img
              src={
                post.user?.avatarUrl
                  ? `http://localhost:8082/uploads/${post.user.avatarUrl}`
                  : `http://localhost:8082/uploads/default-avatar.png`
              }
              alt={post.user?.fullName || 'User'}
              className="w-10 h-10 rounded-full mr-3 cursor-pointer"
              onClick={() => navigate(`/profile/${post.user?.id}`)} // Điều hướng tới trang cá nhân
            />
            <div>
              <h3 className="font-bold dark:text-white">
                {post.user?.fullName || 'Người dùng'}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Nội dung bài viết */}
          <p className="dark:text-gray-300">{post.content}</p>

          {/* Hiển thị media */}
          {post.mediaList && post.mediaList.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {post.mediaList.slice(0, 4).map((media, index) => (
                <div key={media.id} className="relative">
                  <div className="w-full h-[150px] md:h-[200px] overflow-hidden rounded">
                    {isVideo(media.url) ? (
                      <video
                        controls
                        src={`http://localhost:8082/uploads/${media.url}`}
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    ) : (
                      <img
                        src={`http://localhost:8082/uploads/${media.url}`}
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => onPostClick(post, index)} // Truyền index ảnh hiện tại
                      />
                    )}
                    {index === 3 && post.mediaList.length > 4 && (
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold"
                        onClick={() => onPostClick(post, index)}
                      >
                        +{post.mediaList.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Các thông tin khác */}
          <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400">
            <span className="mr-4">{post.reactions?.length || 0} Thích</span>
            <span className="mr-4">{post.totalComments || 0} Bình luận</span>
            <span>{post.shares?.length || 0} Chia sẻ</span>
          </div>

          {/* Bình luận mới nhất */}
          {post.latestComment && (
            <div className="mt-4 border p-2 rounded dark:bg-gray-700">
              <div
                className="cursor-pointer dark:text-white"
                onClick={() => navigate(`/post/${post.id}`, { state: { post } })}
              >
                <p className="font-bold">{post.latestComment.username || 'Người dùng ẩn danh'}</p>
                <p>{post.latestComment.content}</p>
              </div>
            </div>
          )}

          {/* Thêm bình luận */}
          <input
            type="text"
            className="w-full p-2 mt-2 border rounded dark:bg-gray-800 dark:text-white"
            placeholder="Nhập bình luận..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddComment(post.id, e.target.value);
                e.target.value = ''; // Xóa nội dung ô nhập sau khi gửi
              }
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default PostsList;
