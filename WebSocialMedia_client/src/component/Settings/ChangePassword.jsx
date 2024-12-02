import React, { useState } from 'react';
import { changePassword } from '../../api/authApi';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      alert('Password updated successfully.');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password.');
    }
  };

  return (
    <div>
      <label className="block text-gray-700 font-bold mb-2">Current Password</label>
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="border rounded w-full p-2"
      />
      <label className="block text-gray-700 font-bold mb-2 mt-4">New Password</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="border rounded w-full p-2"
      />
      <label className="block text-gray-700 font-bold mb-2 mt-4">Confirm New Password</label>
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="border rounded w-full p-2"
      />
      <button
        onClick={handleChangePassword}
        className="bg-primary text-white px-4 py-2 mt-2 rounded"
      >
        Change Password
      </button>
    </div>
  );
};

export default ChangePassword;
