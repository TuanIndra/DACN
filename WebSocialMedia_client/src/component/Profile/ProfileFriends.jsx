import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFriendsByUserId } from '../../api/friendshipApi';

const getAvatarUrl = (avatarUrl) => {
  const defaultAvatarUrl = 'http://26.159.243.47:8082/uploads/default-avatar.png';
  if (!avatarUrl || avatarUrl === defaultAvatarUrl) {
    return defaultAvatarUrl;
  }
  const cleanedUrl = avatarUrl.replace(/\/{2,}/g, '/');
  return avatarUrl.startsWith('http')
    ? cleanedUrl
    : `http://26.159.243.47:8082/uploads${cleanedUrl.replace('/uploads', '')}`;
};

const ProfileFriends = ({ userId }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      try {
        const response = await fetchFriendsByUserId(userId);
        setFriends(response.data || []);
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFriends();
    } else {
      console.error('userId is undefined in ProfileFriends');
    }
  }, [userId]);

  if (loading) {
    return <p className="text-center text-gray-500 dark:text-gray-400">Đang tải...</p>;
  }

  if (!friends || friends.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400">Không tìm thấy bạn bè nào.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {friends.map((friend) => (
        <div
          key={friend.id}
          className="bg-white dark:bg-gray-800 p-4 shadow-lg rounded-lg flex flex-col items-center cursor-pointer hover:shadow-xl transition"
          onClick={() => navigate(`/profile/${friend.id}`)} // Điều hướng đến trang profile bạn bè
        >
          <img
            src={getAvatarUrl(friend.avatarUrl)}
            alt={friend.fullName || 'Người dùng'}
            className="w-20 h-20 rounded-full object-cover border-2 border-primary dark:border-secondary"
          />
          <h3 className="mt-3 text-center text-gray-800 dark:text-gray-200 font-semibold text-sm">
            {friend.fullName || 'Ẩn danh'}
          </h3>
          <button
            className="mt-2 px-4 py-1 bg-primary dark:bg-secondary text-white text-xs rounded hover:bg-primary/90 dark:hover:bg-secondary/90"
          >
            Xem hồ sơ
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProfileFriends;
