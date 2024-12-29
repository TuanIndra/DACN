import React, { useState, useEffect } from 'react';
import {
  fetchUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} from '../../api/notificationsApi';

const NotificationList = ({ loggedInUserId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetchUserNotifications(loggedInUserId);
        const filteredNotifications = response.data.filter(
          (notif) => notif.recipientId === loggedInUserId
        );
        setNotifications(filteredNotifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Không thể tải thông báo. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    getNotifications();

    // Polling để cập nhật thông báo mới mỗi 30 giây
    const interval = setInterval(getNotifications, 30000);
    return () => clearInterval(interval); // Dọn dẹp interval
  }, [loggedInUserId]);

  const handleMarkAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((notif) => !notif.isRead)
          .map((notif) => markNotificationAsRead(notif.id))
      );

      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => ({
          ...notif,
          isRead: true,
        }))
      );
    } catch (err) {
      console.error('Error marking notifications as read:', err);
      setError('Không thể cập nhật trạng thái thông báo.');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.id !== notificationId)
      );
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Không thể xóa thông báo.');
    }
  };

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

  if (loading) return <p className="text-gray-600 dark:text-gray-400">Đang tải thông báo...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Thông Báo</h2>
        <button
          onClick={handleMarkAllAsRead}
          className="text-sm text-blue-500 hover:underline"
        >
          Đánh dấu tất cả là đã đọc
        </button>
      </div>
      {notifications.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">Bạn không có thông báo nào.</p>
      ) : (
        <ul className="max-h-60 overflow-y-auto">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`flex items-start gap-3 p-3 mb-2 border rounded ${
                notif.isRead
                  ? 'bg-white dark:bg-gray-800'
                  : 'bg-red-100 dark:bg-red-600'
              }`}
            >
              <img
                src={getAvatarUrl(notif.actorAvatarUrl)}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-gray-800 dark:text-white text-sm">{notif.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDeleteNotification(notif.id)}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
