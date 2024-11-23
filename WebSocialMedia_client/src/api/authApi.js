// src/api/authApi.js

import axiosInstance from '../utils/axiosConfig';

// Hàm đăng nhập
export const login = (usernameOrEmail, password) => {
  return axiosInstance.post('/api/auth/login', { usernameOrEmail, password });
};
// Hàm đăng ký
export const register = (fullName, username, email, password) => {
  return axiosInstance.post('/api/auth/register', {
    fullName,
    username,
    email,
    password,
  });
  return response;
};


// Các hàm khác (nếu có)
