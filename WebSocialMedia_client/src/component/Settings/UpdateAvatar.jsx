import React, { useState } from 'react';
import { updateAvatar } from '../../api/authApi';

const UpdateAvatar = () => {
  const [avatar, setAvatar] = useState(null);

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const response = await updateAvatar(file);
      alert('Avatar updated successfully.');
      setAvatar(response.data.avatarUrl);
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert('Failed to update avatar.');
    }
  };

  return (
    <div>
      <label className="block text-gray-700 font-bold mb-2">Avatar</label>
      <input type="file" accept="image/*" onChange={handleAvatarChange} />
    </div>
  );
};

export default UpdateAvatar;
