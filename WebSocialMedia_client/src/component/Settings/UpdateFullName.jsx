import React, { useState } from 'react';
import { updateUserInfo } from '../../api/authApi';

const UpdateFullName = () => {
  const [fullName, setFullName] = useState('');

  const handleUpdateFullName = async () => {
    try {
      await updateUserInfo(fullName);
      alert('Full name updated successfully.');
    } catch (error) {
      console.error('Error updating full name:', error);
      alert('Failed to update full name.');
    }
  };

  return (
    <div>
      <label className="block text-gray-700 font-bold mb-2">Full Name</label>
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="border rounded w-full p-2"
      />
      <button
        onClick={handleUpdateFullName}
        className="bg-primary text-white px-4 py-2 mt-2 rounded"
      >
        Update Full Name
      </button>
    </div>
  );
};

export default UpdateFullName;
