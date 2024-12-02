import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './../../assets/logo.jpg'; // Replace with your logo path

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isFirstLogin = localStorage.getItem('isFirstLogin');
    if (isFirstLogin === 'false') {
      navigate('/homepage'); // Redirect to homepage if it's not the first login
    }
  }, [navigate]);

  const handleStart = () => {
    // Mark first login as complete and redirect to the registration page
    localStorage.setItem('isFirstLogin', 'false');
    navigate('/register');
  };

  const handleLogin = () => {
    localStorage.setItem('isFirstLogin', 'false');
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-secondary">
      {/* Logo */}
      <img
        src={logo}
        alt="Website Logo"
        className="w-40 h-40 md:w-64 md:h-64 object-cover mb-6 rounded-full"
      />
      <h1 className="text-4xl md:text-6xl font-bold text-primary mb-8">Welcome to CapyJoy</h1>
      {/* Buttons */}
      <div className="space-y-4">
        <button
          onClick={handleStart}
          className="px-8 py-4 text-lg font-bold text-white bg-primary rounded-lg shadow hover:bg-primary/90 transition"
        >
          Bắt đầu
        </button>
        <button
          onClick={handleLogin}
          className="px-8 py-4 text-lg font-bold text-primary border border-primary rounded-lg hover:bg-primary/10 transition"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default Welcome;
