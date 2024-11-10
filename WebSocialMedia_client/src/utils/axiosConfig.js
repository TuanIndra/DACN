import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8082', // Thay thế bằng URL của backend của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để đính kèm token nếu cần
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Lấy token từ Local Storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Đính kèm token vào header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
