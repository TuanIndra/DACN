import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../../api/postApi';
import { useNavigate } from 'react-router-dom';

const PostsList = ({ onPostClick }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetchPosts();
        const sortedPosts = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
      } catch (err) {
        setError('Không thể tải danh sách bài viết');
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, []);

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
            <>
              {post.mediaList.length > 2 ? (
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
              ) : (
                post.mediaList.map((media, index) =>
                  isVideo(media.url) ? (
                    <video
                      key={media.id}
                      controls
                      src={`http://localhost:8082/uploads/${media.url}`}
                      className="w-full rounded mb-2 cursor-pointer"
                      onClick={() => onPostClick(post, index)} // Truyền index ảnh hiện tại
                    />
                  ) : (
                    <img
                      key={media.id}
                      src={`http://localhost:8082/uploads/${media.url}`}
                      alt={`Media ${index + 1}`}
                      className="w-full rounded mb-2 cursor-pointer"
                      onClick={() => onPostClick(post, index)} // Truyền index ảnh hiện tại
                    />
                  )
                )
              )}
            </>
          )}

          {/* Các thông tin khác */}
          <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400">
            <span className="mr-4">{post.reactions?.length || 0} Thích</span>
            <span className="mr-4">{post.commentCount || 0} Bình luận</span>
            <span>{post.shares?.length || 0} Chia sẻ</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsList;
