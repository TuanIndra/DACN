import React, { useState } from 'react';
import { updateAvatar } from '../../api/authApi';

const getAvatarUrl = (avatarUrl) => {
    // URL for the default avatar in the database
    const defaultAvatarUrl = 'http://localhost:8082/uploads/default-avatar.png';

    // If the avatar is null, empty, or matches the default avatar URL, return a default avatar
    if (!avatarUrl || avatarUrl === defaultAvatarUrl) {

      return defaultAvatarUrl;
    }
  
    // Remove duplicate slashes and ensure correct path resolution
    const cleanedUrl = avatarUrl.replace(/\/{2,}/g, '/');
    return avatarUrl.startsWith('http')
      ? cleanedUrl // Use full URL if provided
      : `http://localhost:8082/uploads${cleanedUrl.replace('/uploads', '')}`;
      console.log('Final resolved avatarUrl:', finalUrl); // Log the resolved URL
  };

const ProfileHeader = ({ profile, userId, loggedInUserId }) => {
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '/default-avatar.png');

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const response = await updateAvatar(file);
        setAvatarUrl(response.data.avatarUrl);
        alert('Avatar cập nhật thành công!');
      } catch (error) {
        console.error('Error updating avatar:', error);
        alert('Cập nhật avatar thất bại!');
      }
    }
  };

  // Ensure `profile` exists before rendering
  if (!profile) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        Không tìm thấy thông tin người dùng.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded p-4 w-full max-w-4xl mb-6">
      <div className="relative flex flex-col items-center">
        <div className="relative">
          {/* Avatar image */}
          <img
            src={getAvatarUrl(avatarUrl)}
            alt={profile.fullName || 'User'}
            className="w-32 h-32 rounded-full object-cover"
          />
          {/* Update avatar button (only visible for the profile owner) */}
          {userId === loggedInUserId && (
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer shadow-md"
              title="Thay đổi ảnh đại diện"
            >
              ✏️
            </label>
          )}
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        {/* User details */}
        <div className="text-center mt-4">
          <h1 className="text-3xl font-bold dark:text-white">{profile.fullName}</h1>
          <p className="text-gray-500 dark:text-gray-400">@{profile.username}</p>
          <p className="text-gray-700 dark:text-gray-300">
            {profile.bio || 'Không có thông tin giới thiệu'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
