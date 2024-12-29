import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllGroups, isMember, createGroup } from '../../api/groupApi'; // Import API
import Navbar from '../Navbar/Navbar';
import Leftside from '../LeftSidebar/Leftside';
import Rightside from '../RightSidebar/Rightside';
import JoinGroupButton from './JoinGroupButton';
import LeaveGroupButton from './LeaveGroupButton';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [memberStatuses, setMemberStatuses] = useState({}); 

  // Hàm lấy URL ảnh
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

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getAllGroups();
        setGroups(response.data);

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

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const groupData = {
      name: groupName,
      description: groupDescription,
    };
  
    try {
      const response = await createGroup(groupData, groupImage);
      const updatedGroups = await getAllGroups();
      setGroups(updatedGroups.data);
      setShowCreateGroup(false);
      setGroupName('');
      setGroupDescription('');
      setGroupImage(null);
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Có lỗi xảy ra khi tạo nhóm. Vui lòng thử lại!');
    }
  };

  return (
    <div className="w-full dark:bg-gray-900 dark:text-white">
      <div className="fixed top-0 z-10 w-full bg-white shadow-md dark:bg-gray-800">
        <Navbar />
      </div>

      <div className="flex pt-16 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="fixed top-16 left-0 w-[20%] h-[calc(100%-4rem)] bg-white shadow-md dark:bg-gray-800">
          <Leftside />
        </div>

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

        <div className="fixed top-16 right-0 w-[20%] h-[calc(100%-4rem)] bg-white shadow-md dark:bg-gray-800">
          <Rightside />
        </div>
      </div>

      {showCreateGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[90%] lg:w-[50%]">
            <form onSubmit={handleCreateGroup} className="p-6 space-y-4">
              <h2 className="text-2xl font-bold dark:text-white">Tạo nhóm mới</h2>
              <input
                type="text"
                placeholder="Tên nhóm"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white"
                required
              />
              <textarea
                placeholder="Mô tả nhóm"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setGroupImage(e.target.files[0])}
                className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateGroup(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                >
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupList;
