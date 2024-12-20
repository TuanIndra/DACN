import React, { useEffect, useState } from 'react';
import { fetchAcceptedFriends } from '../../api/friendshipApi';
import { useNavigate } from 'react-router-dom';

const RightSide = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetchAcceptedFriends();
        setFriends(response.data || []); // Mỗi bạn bè có thể chứa `unreadMessages`
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, []);

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

  const handleFriendClick = (friend) => {
    // Chuyển hướng sang trang chat với friend.id là receiverId
    navigate(`/chat/${friend.id}`);
  };

  if (loading) {
    return (
      <div className="fixed right-0 w-[20%] h-screen flex flex-col pb-4 bg-primary/20 dark:bg-gray-900">
        <h2 className="text-2xl font-bold p-4 text-gray-800 dark:text-white">
          Đang tải danh sách bạn bè...
        </h2>
      </div>
    );
  }

  return (
    <div className="fixed right-0 w-[20%] h-screen flex flex-col pb-4 border-l-2 border-gray-300 dark:border-gray-700 rounded-l-xl shadow-md bg-primary/20 dark:bg-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold p-4 text-gray-800 dark:text-white">Bạn bè</h2>
      <div className="flex-1 overflow-y-auto px-4">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center p-2 rounded-lg hover:bg-primary/30 transition cursor-pointer"
            onClick={() => handleFriendClick(friend)}
          >
            <div className="relative">
              <img
                src={getAvatarUrl(friend.avatarUrl)}
                alt={friend.fullName || 'Người dùng'}
                className="w-12 h-12 rounded-full border-2 border-primary object-cover"
              />
              {/* Hiển thị số tin nhắn chưa đọc */}
              {friend.unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {friend.unreadMessages}
                </span>
              )}
            </div>
            <span className="ml-3 text-lg font-medium dark:text-white">{friend.fullName || 'Ẩn danh'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSide;
