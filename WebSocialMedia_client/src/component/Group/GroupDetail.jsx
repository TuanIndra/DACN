// src/components/Group/GroupDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGroupDetails, isMember } from '../../api/groupApi';
import JoinGroupButton from './JoinGroupButton';
import GroupMembers from './GroupMembers';
import GroupPosts from './GroupPosts';

const GroupDetail = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [membershipStatus, setMembershipStatus] = useState(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await getGroupDetails(groupId);
        setGroup(response.data);
        // Check membership status
        const memberResponse = await isMember(groupId);
        setMembershipStatus(memberResponse.data);
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  if (!group) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{group.name}</h1>
      <p className="mb-4">{group.description}</p>
      {membershipStatus ? (
        <>
          <GroupMembers groupId={groupId} />
          <GroupPosts groupId={groupId} />
        </>
      ) : (
        <JoinGroupButton groupId={groupId} />
      )}
    </div>
  );
};

export default GroupDetail;
