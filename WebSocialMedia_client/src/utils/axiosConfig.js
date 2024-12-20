// src/utils/axiosConfig.js

import axios from 'axios';

// Create an Axios instance with the base URL of your backend API
const axiosInstance = axios.create({
  baseURL: 'http://26.159.243.47:8082', // Sử dụng IP Radmin VPN
  withCredentials: true,
});

// Add a request interceptor to include the token in every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    // If the token exists, attach it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Optionally, add a response interceptor to handle global errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Token might be invalid or expired
      console.error('Unauthorized access - possibly invalid token');

      // Remove token from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');

      // Redirect to login page
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
