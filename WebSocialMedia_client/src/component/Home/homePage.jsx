import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Leftside from '../LeftSidebar/Leftside';
import Rightside from '../RightSidebar/Rightside';
import PostsList from './PostsList';
import CreatePost from './CreatePost';

const HomePage = () => {
  const [reloadPosts, setReloadPosts] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const navigate = useNavigate();

  const handlePostCreated = () => {
    setReloadPosts(!reloadPosts);
    setShowCreatePost(false);
  };

  const handlePostClick = (post) => {
    navigate(`/post/${post.id}`, { state: { post } });
  };

  const handleShowCreatePost = () => {
    setShowCreatePost(true);
  };

  const handleCloseCreatePost = () => {
    setShowCreatePost(false);
  };

  return (
    <div className="w-full dark:bg-gray-900 dark:text-white">
      {/* Thanh điều hướng */}
      <div className="fixed top-0 z-10 w-full bg-white shadow-md dark:bg-gray-800">
        <Navbar />
      </div>

      <div className="flex pt-16 bg-gray-100 dark:bg-gray-900 min-h-screen">
        {/* Sidebar trái */}
        <div className="fixed top-16 left-0 w-[20%] h-[calc(100%-4rem)] bg-white shadow-md dark:bg-gray-800">
          <Leftside />
        </div>

        {/* Nội dung chính */}
        <div className="w-[60%] max-w-3xl px-4 mx-auto">
          {/* Dòng "Bạn đang nghĩ gì?" */}
          <div
            className="cursor-pointer text-blue-500 dark:text-blue-300 bg-white dark:bg-gray-800 p-4 rounded shadow mb-4"
            onClick={handleShowCreatePost}
          >
            Bạn đang nghĩ gì?
          </div>

          <PostsList key={reloadPosts} onPostClick={handlePostClick} />
        </div>

        {/* Sidebar phải */}
        <div className="fixed top-16 right-0 w-[20%] h-[calc(100%-4rem)] bg-white shadow-md dark:bg-gray-800">
          <Rightside />
        </div>
      </div>

      {/* Modal CreatePost */}
      {showCreatePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[70%] h-[90%] max-h-[90%] p-6 relative overflow-auto">
            <button
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white"
              onClick={handleCloseCreatePost}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 dark:text-white">Tạo bài viết</h2>
            <CreatePost onPostCreated={handlePostCreated} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
