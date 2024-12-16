import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpg'; // Đặt logo của bạn ở đây

const Page404 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Logo */}
      <img
        src={logo}
        alt="Logo"
        className="w-24 h-24 rounded-full mb-6 shadow-lg border-2 border-gray-300 dark:border-gray-700"
      />

      {/* Title */}
      <h1 className="text-6xl font-bold mb-4 text-primary dark:text-primary/80">
        404
      </h1>
      <p className="text-2xl font-medium mb-4">Ôi không! Trang này không tồn tại.</p>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 text-center">
        Có vẻ như bạn đã lạc lối trong không gian. <br />
        Hãy quay về hoặc thử tìm kiếm điều gì đó hữu ích hơn.
      </p>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-primary text-white font-medium rounded-lg shadow hover:bg-primary/90"
        >
          Về Trang Chủ
        </button>
        <button
          onClick={() => navigate('/feedback')}
          className="px-6 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg shadow hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Liên Hệ Chúng Tôi
        </button>
      </div>

      {/* Illustration */}
     
    </div>
  );
};

export default Page404;
