// src/api/friendshipApi.js

import axiosInstance from '../utils/axiosConfig';

// Gửi yêu cầu kết bạn
export const sendFriendRequest = (userId) => {
  return axiosInstance.post('/api/friends/request', null, {
    params: { userId },
  });
};

// Hủy kết bạn hoặc từ chối yêu cầu kết bạn
export const cancelFriendRequest = (friendshipId) => {
  return axiosInstance.post('/api/friends/decline', null, {
    params: { friendshipId },
  });
};
export const unfriend = (friendId) => {
  return axiosInstance.delete(`/api/friends/${friendId}`);
};
// Chấp nhận yêu cầu kết bạn
export const acceptFriendRequest = (friendshipId) => {
  return axiosInstance.post('/api/friends/accept', null, {
    params: { friendshipId },
  });
};

// Lấy danh sách bạn bè đã chấp nhận
export const fetchAcceptedFriends = () => {
  return axiosInstance.get('/api/friends/accepted');
};

// Lấy danh sách yêu cầu kết bạn đã nhận
export const fetchPendingReceivedRequests = () => {
  return axiosInstance.get('/api/friends/pending/received');
};

// Lấy danh sách yêu cầu kết bạn đã gửi
export const fetchPendingSentRequests = () => {
  return axiosInstance.get('/api/friends/pending/sent');
};
export const fetchFriendsByUserId = (userId) => {
  return axiosInstance.get(`/api/friends/user/${userId}/friends`);
};
