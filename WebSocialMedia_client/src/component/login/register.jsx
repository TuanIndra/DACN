import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/authApi';
import logo from "../../assets/logo.jpg";
import spinner from "../../assets/spinner.gif"; // Spinner GIF
import successIcon from "../../assets/success.png"; // Success Icon

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isSuccess, setIsSuccess] = useState(false); // Success state
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    // Validate email format
    if (!validateEmail(email)) {
      setErrorMessage('Email không hợp lệ!');
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setErrorMessage('Mật khẩu phải có ít nhất 8 ký tự!');
      return;
    }

    // Validate password and confirmation
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp!');
      return;
    }

    setIsLoading(true); // Show loading popup

    try {
      await register(fullName, username, email, password);

      // On successful registration
      setIsLoading(false); // Hide loadingin
      setIsSuccess(true); // Show success popup
      setSuccessMessage('Đăng ký thành công! Vui lòng xác thực email của bạn.');

      setTimeout(() => {
        navigate('/login'); // Redirect to login page
      }, 3000);
    } catch (error) {
      setIsLoading(false);
      setIsSuccess(false);
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center">
      {/* Loading Popup */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <img src={spinner} alt="Loading..." className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-800 dark:text-white">Đang xử lý... Vui lòng đợi.</p>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {isSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <img src={successIcon} alt="Success" className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg font-semibold text-green-600">Đăng ký thành công!</p>
            <p className="text-gray-700 dark:text-gray-300">Vui lòng kiểm tra email để xác thực tài khoản.</p>
          </div>
        </div>
      )}

      {/* Logo */}
      <div className="flex items-center mb-8">
        <img src={logo} alt="logo" className="w-16 h-16 rounded-full border-2 border-black" />
        <span className="text-3xl font-bold text-primary ml-3">ᴄᴀᴘʏᴊᴏʏ</span>
      </div>

      {/* Registration Form */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Đăng Ký</h2>

        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-700 dark:text-gray-300">Tên đầy đủ</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tên đầy đủ của bạn"
              required
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 dark:text-gray-300">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tên đăng nhập của bạn"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Nhập mật khẩu của bạn"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/80"
          >
            Đăng Ký
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
