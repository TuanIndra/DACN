import React from 'react';
import { useNavigate } from 'react-router-dom';

const getAvatarUrl = (avatarUrl) => {
  const defaultAvatarUrl = 'http://26.159.243.47:8082/uploads/default-avatar.png';
  if (!avatarUrl || avatarUrl === defaultAvatarUrl) {
    return defaultAvatarUrl;
  }
  const cleanedUrl = avatarUrl.replace(/\/{2,}/g, '/');
  return avatarUrl.startsWith('http')
    ? cleanedUrl
    : `http://26.159.243.47:8082/uploads${cleanedUrl.replace('/uploads', '')}`;
};

const PostHeader = ({
  user,
  group,
  postId,
  createdAt,
  isEditable,
  onEdit,
  onDelete,
  menuVisiblePostId,
  setMenuVisiblePostId,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
      {/* Thông tin người dùng */}
      <div className="flex items-center">
        <img
          src={getAvatarUrl(user?.avatarUrl)}
          alt={user?.fullName || 'User'}
          className="w-12 h-12 rounded-full mr-4 cursor-pointer border dark:border-gray-700"
          onClick={() => navigate(`/profile/${user?.id}`)}
        />
        <div>
          <h3 className="font-semibold dark:text-white text-lg">
            {user?.fullName || 'Người dùng'}
            {group && group.name && (
              <span
                className="text-lg text-primary underline cursor-pointer ml-2"
                onClick={() => navigate(`/groups/${group.id}`)}
              >
                đã đăng trong nhóm {group.name}
              </span>
            )}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Menu hành động */}
      {isEditable && (
        <div className="relative menu-container">
          <button
            className="text-gray-500 dark:text-gray-300 focus:outline-none text-2xl"
            onClick={(e) => {
              e.stopPropagation();
              setMenuVisiblePostId((prev) => (prev === postId ? null : postId));
            }}
          >
            ⋮
          </button>
          {menuVisiblePostId === postId && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border rounded shadow-lg z-10">
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
