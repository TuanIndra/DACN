import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../../api/profileApi';
import { fetchAcceptedFriends } from '../../api/friendshipApi';
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

  const currentUserId = Number(userId);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        const profileResponse = await fetchUserProfile(userId);
        setProfile(profileResponse.data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  useEffect(() => {
    if (activeTab === 'friends') {
      const fetchFriends = async () => {
        try {
          const friendsResponse = await fetchAcceptedFriends(currentUserId);
          setFriends(friendsResponse.data || []);
        } catch (error) {
          console.error('Error fetching friends:', error);
          setFriends([]);
        }
      };

      fetchFriends();
    }
  }, [activeTab, currentUserId]);

  const getAvatarUrl = (avatarUrl) => {
    if (avatarUrl) {
      if (avatarUrl.startsWith('http')) {
        return avatarUrl;
      } else {
        return `http://localhost:8082/uploads/${avatarUrl}`;
      }
    } else {
      return '/default-avatar.png';
    }
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {friends.map((friend) => (
            <div key={friend.id} className="bg-white dark:bg-gray-900 p-4 shadow rounded text-center">
              <img
                src={getAvatarUrl(friend.avatarUrl)}
                alt={friend.fullName || 'Người dùng'}
                className="w-12 h-12 rounded-full mx-auto object-cover"
              />
              <h3 className="mt-2 text-center text-gray-800 dark:text-gray-200">
                {friend.fullName || 'Ẩn danh'}
              </h3>
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
                src={getAvatarUrl(profile.avatarUrl)}
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

        <div className="w-full max-w-4xl">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Profile;
