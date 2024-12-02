// src/components/Group/LeaveGroupButton.jsx
import React from 'react';
import { leaveGroup } from '../../api/groupApi';

const LeaveGroupButton = ({ groupId, onLeaveSuccess }) => {
  const handleLeaveGroup = async () => {
    try {
      await leaveGroup(groupId);
      alert('You have left the group.');
      if (onLeaveSuccess) onLeaveSuccess();
    } catch (error) {
      console.error('Error leaving group:', error);
      alert('Failed to leave the group.');
    }
  };

  return (
    <button onClick={handleLeaveGroup} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
      Leave Group
    </button>
  );
};

export default LeaveGroupButton;
