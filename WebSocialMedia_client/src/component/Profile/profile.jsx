import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserProfile, fetchUserPosts } from '../../api/profileApi';
import Navbar from '../../component/Navbar/Navbar';
import CreatePost from '../../component/Home/CreatePost';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loggedInUserId = Number(localStorage.getItem('userId'));
  const currentUserId = Number(userId);
  

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        const [profileResponse, postsResponse] = await Promise.all([
          fetchUserProfile(userId),
          fetchUserPosts(userId),
        ]);

        setProfile(profileResponse.data);
        setPosts(postsResponse.data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  const isVideo = (url) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    return videoExtensions.some((ext) => url.endsWith(ext));
  };

  const renderMedia = (mediaList) => {
    if (mediaList.length > 5) {
      return (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {mediaList.slice(0, 5).map((media, index) =>
            isVideo(media.url) ? (
              <video
                key={index}
                controls
                src={`http://localhost:8082/uploads/${media.url}`}
                className="w-full rounded"
              />
            ) : (
              <img
                key={index}
                src={`http://localhost:8082/uploads/${media.url}`}
                alt={`Media ${index + 1}`}
                className="w-full rounded"
              />
            )
          )}
          <div className="relative">
            <div
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-bold"
              onClick={() => console.log('Show all media')}
            >
              +{mediaList.length - 5}
            </div>
          </div>
        </div>
      );
    }

    if (mediaList.length > 2) {
      return (
        <div className="grid grid-cols-2 gap-2 mt-2">
          {mediaList.map((media, index) =>
            isVideo(media.url) ? (
              <video
                key={index}
                controls
                src={`http://localhost:8082/uploads/${media.url}`}
                className="w-full rounded"
              />
            ) : (
              <img
                key={index}
                src={`http://localhost:8082/uploads/${media.url}`}
                alt={`Media ${index + 1}`}
                className="w-full rounded"
              />
            )
          )}
        </div>
      );
    }

    return mediaList.map((media, index) =>
      isVideo(media.url) ? (
        <video
          key={index}
          controls
          src={`http://localhost:8082/uploads/${media.url}`}
          className="w-full rounded mt-2"
        />
      ) : (
        <img
          key={index}
          src={`http://localhost:8082/uploads/${media.url}`}
          alt={`Media ${index + 1}`}
          className="w-full rounded mt-2"
        />
      )
    );
  };

  if (loading) return <p className="text-gray-500 dark:text-gray-400">Đang tải...</p>;
  if (error) return <p className="text-red-500 dark:text-red-400">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col items-center mt-4">
        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded p-4 w-full max-w-4xl mb-6">
          {profile && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={
                    profile.avatarUrl
                      ? `http://localhost:8082/uploads/${profile.avatarUrl}`
                      : `http://localhost:8082/uploads/default-avatar.png`
                  }
                  alt={profile.fullName || 'User'}
                  className="w-20 h-20 rounded-full mr-4"
                />
                <div>
                  <h1 className="text-2xl font-bold dark:text-white">{profile.fullName}</h1>
                  <p className="text-gray-500 dark:text-gray-400">@{profile.username}</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {profile.bio || 'Không có thông tin giới thiệu'}
                  </p>
                </div>
              </div>
              {loggedInUserId !== currentUserId && (
  <button className="bg-primary text-white px-4 py-2 rounded">Thêm bạn bè</button>
)}
            </div>
          )}
        </div>

        {/* Create Post Section */}
        {loggedInUserId === userId && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded p-4 w-full max-w-4xl mb-6">
            <CreatePost />
          </div>
        )}

        {/* Posts Section */}
        <div className="w-full max-w-4xl">
          {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 shadow-md rounded p-4 mb-4">
              {/* User Info */}
              <div className="flex items-center mb-2">
                <img
                  src={
                    post.user?.avatarUrl
                      ? `http://localhost:8082/uploads/${post.user.avatarUrl}`
                      : `http://localhost:8082/uploads/default-avatar.png`
                  }
                  alt={post.user?.fullName || 'User'}
                  className="w-10 h-10 rounded-full mr-3 cursor-pointer"
                  onClick={() => navigate(`/profile/${post.user?.id}`)}
                />
                <div>
                  <h3 className="font-bold dark:text-white">{post.user?.fullName || 'Người dùng'}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <p className="dark:text-gray-300">{post.content}</p>

              {/* Media */}
              {post.mediaList && post.mediaList.length > 0 && renderMedia(post.mediaList)}

              {/* Post Details */}
              <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400">
                <span className="mr-4">{post.reactions?.length || 0} Thích</span>
                <span className="mr-4">{post.commentCount || 0} Bình luận</span>
                <span>{post.shares?.length || 0} Chia sẻ</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
