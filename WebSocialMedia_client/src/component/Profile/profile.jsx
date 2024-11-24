// src/pages/Profile/Profile.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../../api/profileApi';
import Navbar from '../../component/Navbar/Navbar';
import PostsList from '../../component/Home/PostsList';
import CreatePost from '../../component/Home/CreatePost';
import FriendRequestButton from '../../component/Friend/FriendRequestButton';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [friends, setFriends] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loggedInUserId = Number(localStorage.getItem('userId'));
  const currentUserId = Number(userId);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        const profileResponse = await fetchUserProfile(userId);
        setProfile(profileResponse.data);

        // Nếu cần, bạn có thể tải danh sách bạn bè của người dùng
        // const friendsResponse = await fetchUserFriends(userId);
        // setFriends(friendsResponse.data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  const renderTabContent = () => {
    if (activeTab === 'posts') {
      return (
        <PostsList
          userId={currentUserId}
          onPostClick={(post, index) =>
            navigate(`/post/${post.id}`, { state: { post, currentImageIndex: index } })
          }
        />
      );
    } else if (activeTab === 'friends') {
      if (friends.length === 0) {
        return (
          <p className="text-center text-gray-500 dark:text-gray-400">Không tìm thấy bạn bè nào.</p>
        );
      }
      return (
        <div className="grid grid-cols-3 gap-4">
          {friends.map((friend) => (
            <div key={friend.id} className="text-center">
              <img
                src={
                  friend.avatarUrl
                    ? `http://localhost:8082/uploads/${friend.avatarUrl}`
                    : `http://localhost:8082/uploads/default-avatar.png`
                }
                alt={friend.fullName || 'User'}
                className="w-16 h-16 rounded-full mx-auto"
              />
              <p className="mt-2 dark:text-white">{friend.fullName}</p>
            </div>
          ))}
        </div>
      );
    }
  };

  if (loading) return <p className="text-gray-500 dark:text-gray-400">Đang tải...</p>;
  if (error) return <p className="text-red-500 dark:text-red-400">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-col items-center mt-4">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded p-4 w-full max-w-4xl mb-6">
          {profile && (
            <div className="flex flex-col items-center">
              <img
                src={
                  profile.avatarUrl && !profile.avatarUrl.startsWith('http')
                    ? `http://localhost:8082/uploads/${profile.avatarUrl}`
                    : profile.avatarUrl || `http://localhost:8082/uploads/default-avatar.png`
                }
                alt={profile.fullName || 'User'}
                className="w-32 h-32 rounded-full mb-4"
              />
              <div className="text-center">
                <h1 className="text-3xl font-bold dark:text-white">{profile.fullName}</h1>
                <p className="text-gray-500 dark:text-gray-400">@{profile.username}</p>
                <p className="text-gray-700 dark:text-gray-300">
                  {profile.bio || 'Không có thông tin giới thiệu'}
                </p>
              </div>

              {/* Sử dụng component FriendRequestButton */}
              <FriendRequestButton currentUserId={currentUserId} />
            </div>
          )}

          {/* Tabs */}
          <div className="flex justify-around mt-6">
            <button
              className={`px-4 py-2 ${
                activeTab === 'posts' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('posts')}
            >
              Bài viết
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === 'friends' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('friends')}
            >
              Bạn bè
            </button>
          </div>
        </div>

        {activeTab === 'posts' && loggedInUserId === currentUserId && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded p-4 w-full max-w-4xl mb-6">
            <CreatePost />
          </div>
        )}

        <div className="w-full max-w-4xl">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Profile;
