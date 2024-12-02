import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllGroups, isMember } from '../../api/groupApi';
import Navbar from '../Navbar/Navbar';
import Leftside from '../LeftSidebar/Leftside';
import Rightside from '../RightSidebar/Rightside';
import CreateGroup from './CreateGroup'; // Component tạo nhóm
import JoinGroupButton from './JoinGroupButton'; // Nút tham gia nhóm
import LeaveGroupButton from './LeaveGroupButton'; // Nút rời nhóm

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [memberStatuses, setMemberStatuses] = useState({}); // Trạng thái thành viên theo groupId

  // Lấy danh sách nhóm
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getAllGroups();
        setGroups(response.data);

        // Kiểm tra trạng thái thành viên cho từng nhóm
        const statuses = {};
        await Promise.all(
          response.data.map(async (group) => {
            try {
              const isMemberResponse = await isMember(group.id);
              statuses[group.id] = isMemberResponse.data;
            } catch (error) {
              statuses[group.id] = false;
              console.error(`Error checking membership for group ${group.id}:`, error);
            }
          })
        );
        setMemberStatuses(statuses);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);
  const getAvatarUrl = (imageUrl) => {
    const defaultAvatarUrl = 'http://localhost:8082/uploads/default-avatar.png';
    if (!imageUrl || imageUrl === defaultAvatarUrl) {
      return defaultAvatarUrl;
    }
    const cleanedUrl = imageUrl.replace(/\/{2,}/g, '/');
    return imageUrl.startsWith('http')
      ? cleanedUrl
      : `http://localhost:8082/uploads${cleanedUrl.replace('/uploads', '')}`;
  };

  // Làm mới trạng thái thành viên
  const refreshMembership = async (groupId) => {
    try {
      const isMemberResponse = await isMember(groupId);
      setMemberStatuses((prevStatuses) => ({
        ...prevStatuses,
        [groupId]: isMemberResponse.data,
      }));
    } catch (error) {
      console.error(`Error refreshing membership for group ${groupId}:`, error);
    }
  };

  return (
    <div className="w-full dark:bg-gray-900 dark:text-white">
      {/* Navbar */}
      <div className="fixed top-0 z-10 w-full bg-white shadow-md dark:bg-gray-800">
        <Navbar />
      </div>

      <div className="flex pt-16 bg-gray-100 dark:bg-gray-900 min-h-screen">
        {/* Sidebar trái */}
        <div className="fixed top-16 left-0 w-[20%] h-[calc(100%-4rem)] bg-white shadow-md dark:bg-gray-800">
          <Leftside />
        </div>

        {/* Nội dung chính */}
        <div className="w-[60%] max-w-3xl px-4 mx-auto">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Danh sách nhóm</h1>
          <button
            className="bg-primary text-white px-4 py-2 rounded mb-4 hover:bg-primary/90"
            onClick={() => setShowCreateGroup(true)}
          >
            Tạo nhóm mới
          </button>
          <ul className="space-y-4">
            {groups.map((group) => (
              <li
                key={group.id}
                className="border p-4 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-between shadow-md"
              >
                {/* Avatar nhóm */}
                <div className="flex items-center space-x-4">
                  <img
                   src={getAvatarUrl(group.imageUrl)}
                    alt="Group Avatar"
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <Link
                    to={`/groups/${group.id}`}
                    className="text-primary font-semibold hover:underline"
                  >
                    {group.name}
                  </Link>
                </div>
                <div>
                  {memberStatuses[group.id] ? (
                    <LeaveGroupButton
                      groupId={group.id}
                      onLeaveSuccess={() => refreshMembership(group.id)}
                    />
                  ) : (
                    <JoinGroupButton
                      groupId={group.id}
                      onJoinSuccess={() => refreshMembership(group.id)}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar phải */}
        <div className="fixed top-16 right-0 w-[20%] h-[calc(100%-4rem)] bg-white shadow-md dark:bg-gray-800">
          <Rightside />
        </div>
      </div>

      {/* Modal tạo nhóm */}
     
    </div>
  );
};

export default GroupList;
