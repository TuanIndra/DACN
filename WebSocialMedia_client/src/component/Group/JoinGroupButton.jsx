// src/components/Group/JoinGroupButton.jsx
import React from 'react';
import { requestToJoinGroup } from '../../api/groupApi';

const JoinGroupButton = ({ groupId }) => {
  const handleJoinGroup = async () => {
    try {
      await requestToJoinGroup(groupId);
      alert('Join request sent');
    } catch (error) {
      console.error('Error requesting to join group:', error);
      alert('Failed to send join request');
    }
  };

  return (
    <button onClick={handleJoinGroup} className="bg-primary text-white px-4 py-2 rounded">
      Request to Join Group
    </button>
  );
};

export default JoinGroupButton;
