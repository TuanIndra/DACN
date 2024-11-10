// src/api/authApi.js

import axiosInstance from '../utils/axiosConfig';

// Hàm đăng nhập
export const login = (username, password) => {
  return axiosInstance.post('/api/auth/login', { username, password });
};
// Hàm đăng ký
export const register = (username, email, password) => {
    return axiosInstance.post('/api/auth/register', { username, email, password });
  };
// Các hàm khác (nếu có)
