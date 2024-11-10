// src/pages/Register.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/authApi'; // Import hàm register từ authApi.js
import logo from "../../assets/logo.jpg";
import { FaFacebookF, FaGoogle, FaTwitter } from "react-icons/fa";

const Register = () => {
  const [username, setUsername] = useState(''); // State cho username
  const [email, setEmail] = useState(''); // State cho email
  const [password, setPassword] = useState(''); // State cho password
  const [confirmPassword, setConfirmPassword] = useState(''); // State cho xác nhận mật khẩu
  const [errorMessage, setErrorMessage] = useState(''); // State cho thông báo lỗi
  const [successMessage, setSuccessMessage] = useState(''); // State cho thông báo thành công
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp!');
      return;
    }

    try {
      const response = await register(username, email, password); // Gọi hàm register từ authApi.js

      // Xử lý phản hồi từ backend
      setSuccessMessage('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
      setErrorMessage('');
      
      // Sau vài giây, chuyển hướng đến trang đăng nhập
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      // Xử lý lỗi từ server
      if (error.response) {
        // Hiển thị thông báo lỗi từ backend (nếu có)
        setErrorMessage(error.response.data.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
      } else {
        // Lỗi không có phản hồi từ server
        setErrorMessage('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
      setSuccessMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <img src={logo} alt="logo" className="w-16 h-16 rounded-full border-2 border-black" />
        <span className="text-3xl font-bold text-primary ml-3">ᴄᴀᴘʏᴊᴏʏ</span>
      </div>

      {/* Register Form */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Đăng Ký</h2>
        
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 dark:text-gray-300">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tên đăng nhập của bạn"
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập mật khẩu của bạn"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-gray-700 dark:text-white"
              placeholder="Xác nhận mật khẩu của bạn"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/80 transition"
          >
            Đăng Ký
          </button>
        </form>

        {/* Social Register Options (Tùy chọn) */}
        <div className="mt-6 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">Hoặc đăng ký với</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700">
              <FaFacebookF className="w-6 h-6" />
            </button>
            <button className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700">
              <FaGoogle className="w-6 h-6" />
            </button>
            <button className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500">
              <FaTwitter className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-700 dark:text-gray-300">
          Bạn đã có tài khoản? 
          <a href="/" className="text-primary hover:underline ml-2">Đăng nhập ngay</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
