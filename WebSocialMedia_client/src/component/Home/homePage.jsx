import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Leftside from "../LeftSidebar/Leftside";
import Rightside from "../RightSidebar/Rightside";
import PostsList from "./PostsList";
import CreatePost from "./CreatePost";

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
    <div className="w-full min-h-screen dark:bg-gray-900 dark:text-white">
      {/* Navbar */}
      <div className="fixed top-0 z-10 w-full bg-white dark:bg-gray-800 shadow">
        <Navbar />
      </div>

      <div className="flex pt-16 bg-gray-100 dark:bg-gray-900">
        {/* Left Sidebar */}
        <div className="hidden lg:block fixed top-16 left-0 w-[20%] h-[calc(100%-4rem)] bg-white dark:bg-gray-800 border-r shadow-lg">
          <Leftside />
        </div>

        {/* Main Content */}
        <div className="flex-grow lg:ml-[20%] lg:mr-[20%] max-w-3xl mx-auto px-4 pt-4 pb-6">
          {/* "What's on your mind?" */}
          <div
            className="cursor-pointer bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-4 rounded-lg shadow-md mb-6 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handleShowCreatePost}
          >
            <span className="text-lg">Bạn đang nghĩ gì?</span>
          </div>

          {/* Posts List */}
          <PostsList key={reloadPosts} onPostClick={handlePostClick} />
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block fixed top-16 right-0 w-[20%] h-[calc(100%-4rem)] bg-white dark:bg-gray-800 border-l shadow-lg">
          <Rightside />
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[90%] lg:w-[70%] max-h-[90%] overflow-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white"
              onClick={handleCloseCreatePost}
            >
              ✕
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">
                Tạo bài viết
              </h2>
              <CreatePost onPostCreated={handlePostCreated} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
