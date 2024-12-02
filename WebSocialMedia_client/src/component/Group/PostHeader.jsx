// src/components/Group/PostHeader.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const getAvatarUrl = (avatarUrl) => {
  const defaultAvatarUrl = 'http://localhost:8082/uploads/default-avatar.png';
  if (!avatarUrl || avatarUrl === defaultAvatarUrl) {
    return defaultAvatarUrl;
  }
  const cleanedUrl = avatarUrl.replace(/\/{2,}/g, '/');
  return avatarUrl.startsWith('http')
    ? cleanedUrl
    : `http://localhost:8082/uploads${cleanedUrl.replace('/uploads', '')}`;
};

const PostHeader = ({
  user,
  groupName,
  postId,
  createdAt,
  isEditable,
  onEdit,
  onDelete,
  menuVisiblePostId,
  setMenuVisiblePostId,
}) => {
  const navigate = useNavigate();

  console.log('PostHeader groupName:', groupName); // Should now log the group name

  return (
    <div className="flex items-center justify-between mb-2">
      {/* User Info */}
      <div className="flex items-center">
        <img
          src={getAvatarUrl(user?.avatarUrl)}
          alt={user?.fullName || 'User'}
          className="w-10 h-10 rounded-full mr-3 cursor-pointer"
          onClick={() => navigate(`/profile/${user?.id}`)}
        />
        <div>
          <h3 className="font-bold dark:text-white">
            {user?.fullName || 'Người dùng'}
            {groupName && (
              <span className="text-sm text-primary dark:text-secondary ml-2">
                đã đăng trong nhóm {groupName}
              </span>
            )}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Action Menu */}
      {isEditable && (
        <div className="relative menu-container">
          <button
            className="text-gray-500 dark:text-gray-300 focus:outline-none text-2xl"
            onClick={(e) => {
              e.stopPropagation();
              setMenuVisiblePostId((prev) =>
                prev === postId ? null : postId
              );
            }}
          >
            ⋮
          </button>
          {menuVisiblePostId === postId && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border rounded shadow-lg z-10">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  onEdit(postId);
                  setMenuVisiblePostId(null);
                }}
              >
                Chỉnh sửa
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  onDelete(postId);
                  setMenuVisiblePostId(null);
                }}
              >
                Xóa
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostHeader;
