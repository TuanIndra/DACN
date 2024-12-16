// src/api/notificationsApi.js
import axiosInstance from '../utils/axiosConfig';

export const fetchUserNotifications = () => {
  return axiosInstance.get('api/notifications'); // GET /api/notifications
};

export const markNotificationAsRead = (notificationId) => {
  return axiosInstance.put(`api/notifications/${notificationId}/read`); // PUT /api/notifications/{notificationId}/read
};
export const fetchUserNotificationsById = (userId) => {
    if (!userId) throw new Error('User ID is required');
  return axiosInstance.get(`/api/notifications/user/${userId}`);
};
 
export const deleteNotification = (notificationId) => {
  return axiosInstance.delete(`api/notifications/${notificationId}`); // DELETE /api/notifications/{notificationId}
};
