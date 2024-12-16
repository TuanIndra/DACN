// src/components/Login/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.jpg";
import { FaGoogle } from "react-icons/fa";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "../../../firebaseConfig";
import { login } from "../../api/authApi"; // Login API function

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // Đăng nhập bằng Google
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;

        // Lưu thông tin người dùng từ Firebase
        console.log("Đăng nhập thành công:", user);

        // Điều hướng đến trang chính
        localStorage.setItem('user', JSON.stringify({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }));
        navigate('/homepage');
      })
      .catch((error) => {
        console.error("Lỗi đăng nhập:", error);
        setErrorMessage('Lỗi đăng nhập với Google. Vui lòng thử lại.');
      });
  };

  // Đăng nhập bằng tài khoản cơ sở dữ liệu
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await login(usernameOrEmail, password);

      // Lưu thông tin đăng nhập vào localStorage
      const { token, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);

      // Điều hướng đến trang chính
      navigate('/homepage');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Tên đăng nhập hoặc mật khẩu không chính xác!');
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

        {/* Login bằng username và mật khẩu */}
        <form onSubmit={handleLoginSubmit}>
          <div className="mb-4">
            <label htmlFor="usernameOrEmail" className="block text-gray-700 dark:text-gray-300">
              Tên đăng nhập hoặc Email
            </label>
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
            <button
              type="button"
              onClick={() => navigate('/forgot-password')} // Điều hướng đến trang Quên mật khẩu
              className="text-sm text-primary hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/80 transition"
          >
            Đăng Nhập
          </button>
        </form>

        {/* Đăng nhập với Google */}
        <div className="mt-6 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">Hoặc đăng nhập với</p>
          <div className="flex justify-center">
            <button onClick={signInWithGoogle} className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700">
              <FaGoogle className="w-6 h-6" />
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
