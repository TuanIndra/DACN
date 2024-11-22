import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle, FaCog, FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Import icons

const PostDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy bài viết và index ảnh hiện tại từ state
  const post = location.state?.post;
  const initialIndex = location.state?.currentImageIndex || 0;

  // State để quản lý index ảnh hiện tại
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Không tìm thấy bài viết.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate('/')}
        >
          Quay lại Trang chủ
        </button>
      </div>
    );
  }

  // Xử lý chuyển ảnh
  const handleNextImage = () => {
    if (post.mediaList && currentImageIndex < post.mediaList.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (post.mediaList && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Khu vực ảnh bên trái */}
      <div className="relative w-[70%] flex items-center justify-center bg-white dark:bg-gray-800">
        {/* Nút quay lại */}
        <button
          className="absolute top-4 left-4 bg-gray-700 text-white rounded-full p-2 shadow hover:bg-gray-500"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </button>

        {/* Nút chuyển ảnh bên trái */}
        {currentImageIndex > 0 && (
          <button
            className="absolute left-2 z-10 bg-gray-700 text-white rounded-full p-2 shadow hover:bg-gray-500"
            onClick={handlePreviousImage}
          >
            <FaArrowLeft size={24} />
          </button>
        )}

        {/* Ảnh hiển thị */}
        <div className="w-full h-screen flex items-center justify-center">
          <img
            src={`http://localhost:8082/uploads/${post.mediaList[currentImageIndex]?.url}`}
            alt={`Media ${currentImageIndex + 1}`}
            className="max-h-full w-auto object-contain"
          />
        </div>

        {/* Nút chuyển ảnh bên phải */}
        {currentImageIndex < post.mediaList.length - 1 && (
          <button
            className="absolute right-2 z-10 bg-gray-700 text-white rounded-full p-2 shadow hover:bg-gray-500"
            onClick={handleNextImage}
          >
            <FaArrowRight size={24} />
          </button>
        )}
      </div>

      {/* Sidebar bên phải */}
      <div className="w-[30%] bg-slate-300 dark:bg-gray-700 p-4 shadow-lg flex flex-col">
        <div className="flex justify-between mb-6">
          <button
            className="p-2 bg-primary text-white rounded-full shadow hover:bg-opacity-80"
            onClick={() => navigate('/notifications')}
          >
            <FaBell size={24} />
          </button>
          <button
            className="p-2 bg-primary text-white rounded-full shadow hover:bg-opacity-80"
            onClick={() => navigate('/profile')}
          >
            <FaUserCircle size={24} />
          </button>
          <button
            className="p-2 bg-primary text-white rounded-full shadow hover:bg-opacity-80"
            onClick={() => navigate('/settings')}
          >
            <FaCog size={24} />
          </button>
        </div>

        {/* Nội dung bài viết */}
        <div className="flex-grow overflow-auto">
          <h3 className="text-2xl font-bold mb-4 dark:text-white">
            {post.user?.fullName || 'Người dùng'}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-8">{post.content}</p>

          {/* Thông tin khác */}
          <div className="grid grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center justify-center px-4 py-2 border rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
              <span className="font-bold">{post.reactions?.length || 0}</span>
              <span>Thích</span>
            </div>
            <div className="flex flex-col items-center justify-center px-4 py-2 border rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
              <span className="font-bold">{post.comments?.length || 0}</span>
              <span>Bình luận</span>
            </div>
            <div className="flex flex-col items-center justify-center px-4 py-2 border rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
              <span className="font-bold">{post.shares?.length || 0}</span>
              <span>Chia sẻ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
