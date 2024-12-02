// src/components/Group/CreateGroup.jsx
import React, { useState } from 'react';
import { createGroup } from '../../api/groupApi';

const CreateGroup = () => {
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    privacy: 'PUBLIC',
  });
  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    setGroupData({ ...groupData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGroup(groupData, imageFile);
      alert('Group created successfully');
      // Redirect or update UI
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Create a New Group</h2>
      <div className="mb-2">
        <label className="block">Group Name</label>
        <input
          type="text"
          name="name"
          value={groupData.name}
          onChange={handleInputChange}
          className="border rounded w-full p-2"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block">Description</label>
        <textarea
          name="description"
          value={groupData.description}
          onChange={handleInputChange}
          className="border rounded w-full p-2"
        />
      </div>
      <div className="mb-2">
        <label className="block">Privacy</label>
        <select
          name="privacy"
          value={groupData.privacy}
          onChange={handleInputChange}
          className="border rounded w-full p-2"
        >
          <option value="PUBLIC">Public</option>
          <option value="PRIVATE">Private</option>
          <option value="SECRET">Secret</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block">Group Image</label>
        <input type="file" onChange={handleFileChange} />
      </div>
      <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
        Create Group
      </button>
    </form>
  );
};

export default CreateGroup;
