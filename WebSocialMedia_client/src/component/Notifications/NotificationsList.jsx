import React, { useState, useEffect } from 'react';
import { fetchUserNotificationsById } from '../../api/notificationsApi';

const NotificationList = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError('User ID is required to fetch notifications.');
      setLoading(false);
      return;
    }

    const getNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetchUserNotificationsById(userId);
        setNotifications(response.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Không thể tải thông báo. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    getNotifications();
  }, [userId]);

  const getAvatarUrl = (avatarUrl) => {
    const defaultAvatarUrl = 'http://localhost:8082/uploads/default-avatar.png';
    if (!avatarUrl || avatarUrl === defaultAvatarUrl) {
      return defaultAvatarUrl;
    }
    const cleanedUrl = avatarUrl.replace(/\/{2,}/g, '/');
    return avatarUrl.startsWith('http')
      ? cleanedUrl
      : `http://localhost:8082/uploads${cleanedUrl.replace('/uploads', '')}`;
  };

  if (loading) return <p className="text-gray-600 dark:text-gray-400">Đang tải thông báo...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
      <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Thông Báo</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">Bạn không có thông báo nào.</p>
      ) : (
        <ul className="max-h-60 overflow-y-auto">
          {notifications.map((notif, index) => (
            <li
              key={notif.id}
              className={`flex items-start gap-3 p-3 mb-2 border rounded ${
                notif.isRead
                  ? 'bg-white dark:bg-gray-800'
                  : 'bg-gray-100 dark:bg-gray-600'
              }`}
            >
              <img
                src={getAvatarUrl(notif.actorAvatarUrl)}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-gray-800 dark:text-white text-sm">{notif.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
