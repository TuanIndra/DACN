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
// Gửi email để reset mật khẩu
export const forgotPassword = (email) => {
  return axiosInstance.post('/api/auth/forgot-password', null, {
    params: { email },
  });
};

// Đặt lại mật khẩu với token
// Reset password
export const resetPassword = (token, newPassword) => {
  return axiosInstance.post('/api/auth/reset-password', null, {
    params: { token, newPassword },
  });
};


// Cập nhật thông tin người dùng
export const updateUserInfo = (fullName, bio) => {
  return axiosInstance.put('/api/auth/update-info', { fullName, bio });
};
export const updateAvatar = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return axiosInstance.put('/api/auth/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const changePassword = (currentPassword, newPassword) => {
  return axiosInstance.put('/api/auth/change-password', {
    currentPassword,
    newPassword,
  });
};

// Fetch User Info API
export const fetchUserInfo = () => {
  return axiosInstance.get('/api/auth/user-info');
};
// Các hàm khác (nếu có)
