import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi'; // Import the login API function
import logo from "../../assets/logo.jpg";
import { FaFacebookF, FaGoogle, FaTwitter } from "react-icons/fa";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message
  
    try {
      const response = await login(usernameOrEmail, password);
      
      // Debugging: Log the full response object
      console.log('API Response:', response);
      
      // Extract the token from the correct location in the response
      const token = response.data.token; // Update this line based on actual response structure
      console.log('Login successful! Token:', token);
      
      // Save the token in localStorage
      localStorage.setItem('token', token);
  
      // Optionally, save the user ID or other user info if provided
      const userId = response.data.userId; // Adjust if necessary
      localStorage.setItem('userId', userId);
  
      // Navigate to the homepage
      navigate('/homepage'); 
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Đăng nhập thất bại!');
      } else {
        setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại!');
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <img src={logo} alt="logo" className="w-16 h-16 rounded-full border-2 border-black" />
        <span className="text-3xl font-bold text-primary ml-3">ᴄᴀᴘʏᴊᴏʏ</span>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Đăng Nhập</h2>

        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="usernameOrEmail" className="block text-gray-700 dark:text-gray-300">Tên đăng nhập hoặc Email</label>
            <input
              type="text"
              id="usernameOrEmail"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tên đăng nhập hoặc email"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
              />
              <span className="text-gray-700 dark:text-gray-300">Ghi nhớ tôi</span>
            </label>
            <a href="#" className="text-sm text-primary hover:underline">Quên mật khẩu?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/80 transition"
          >
            Đăng Nhập
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">Hoặc đăng nhập với</p>
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

        <p className="mt-6 text-center text-gray-700 dark:text-gray-300">
          Bạn chưa có tài khoản? 
          <a href="/register" className="text-primary hover:underline ml-2">Đăng ký ngay</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
