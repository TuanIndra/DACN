import axiosInstance from '../utils/axiosConfig';

// Fetch user profile details
export const fetchUserProfile = (userId) => {
  return axiosInstance.get(`/api/profile/${userId}`);
};

// Fetch user posts
export const fetchUserPosts = (userId) => {
  return axiosInstance.get(`/api/profile/${userId}/posts`);
};

// Fetch user friends
export const fetchUserFriends = (userId) => {
  return axiosInstance.get(`/api/profile/${userId}/friends`);
};
