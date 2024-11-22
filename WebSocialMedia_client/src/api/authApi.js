// src/api/authApi.js

import axiosInstance from '../utils/axiosConfig';

// Hàm đăng nhập
export const login = (username, password) => {
  return axiosInstance.post('/api/auth/login', { username, password });
};
// Hàm đăng ký
export const register = async (fullName, username, email, password, avatarUrl) => {
  const response = await axios.post('/api/auth/register', {
    fullName,
    username,
    email,
    password,
    avatarUrl, // Gửi kèm avatarUrl
  });
  return response;
};


// Các hàm khác (nếu có)
