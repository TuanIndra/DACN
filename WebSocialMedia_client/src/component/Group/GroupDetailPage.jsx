import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import GroupMembers from './GroupMembers';
import GroupPosts from './GroupPosts';
import JoinGroupButton from './JoinGroupButton';
import GroupRequests from './GroupRequests';
import { getGroupDetails, isMember, isAdminOfGroup } from '../../api/groupApi';

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const [activeTab, setActiveTab] = useState('posts');
  const [group, setGroup] = useState(null);
  const [userIsMember, setUserIsMember] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  const getAvatarUrl = (imageUrl) => {
    const defaultAvatarUrl = 'http://26.159.243.47:8082/uploads/default-avatar.png';
    if (!imageUrl || imageUrl === defaultAvatarUrl) {
      return defaultAvatarUrl;
    }
    const cleanedUrl = imageUrl.replace(/\/{2,}/g, '/');
    return imageUrl.startsWith('http')
      ? cleanedUrl
      : `http://26.159.243.47:8082/uploads${cleanedUrl.replace('/uploads', '')}`;
  };

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const groupResponse = await getGroupDetails(groupId);
        setGroup(groupResponse.data);

        const memberResponse = await isMember(groupId);
        setUserIsMember(memberResponse.data);

        const adminResponse = await isAdminOfGroup(groupId);
        setUserIsAdmin(adminResponse.data);
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };

    fetchGroupData();
  }, [groupId]);

  if (!group) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-secondary dark:bg-gray-900">
          <p className="text-lg text-gray-600 dark:text-gray-400">Đang tải thông tin nhóm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary dark:bg-gray-900">
      <Navbar />

      <div className="mt-16 flex justify-center">
        <div className="container max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          {/* Ảnh nhóm */}
          {group.imageUrl && (
            <div className="flex justify-center mb-6">
              <img
                src={getAvatarUrl(group.imageUrl)}
                alt={group.name || 'Group'}
                className="w-32 h-32 rounded-full object-cover shadow-md"
              />
            </div>
          )}

          {/* Tên và mô tả nhóm */}
          <h1 className="text-3xl font-bold mb-4 text-center text-primary dark:text-white">
            {group.name}
          </h1>
          <p className="text-center text-gray-700 dark:text-gray-300 mb-8">{group.description}</p>

          {/* Nút tham gia nhóm */}
          {!userIsMember && (
            <div className="flex justify-center mb-8">
              <JoinGroupButton groupId={groupId} onJoinSuccess={() => setUserIsMember(true)} />
            </div>
          )}

          {/* Tabs */}
          <div className="flex justify-around border-b pb-2 mb-6">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-2 text-lg font-medium ${
                activeTab === 'posts'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 dark:text-gray-400 hover:text-primary'
              }`}
            >
              Bài viết
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-2 text-lg font-medium ${
                activeTab === 'members'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 dark:text-gray-400 hover:text-primary'
              }`}
            >
              Thành viên
            </button>
            {userIsAdmin && (
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2 text-lg font-medium ${
                  activeTab === 'requests'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 dark:text-gray-400 hover:text-primary'
                }`}
              >
                Yêu cầu
              </button>
            )}
          </div>

          {/* Nội dung Tabs */}
          <div>
            {activeTab === 'posts' && <GroupPosts groupId={groupId} />}
            {activeTab === 'members' && <GroupMembers groupId={groupId} />}
            {activeTab === 'requests' && userIsAdmin && <GroupRequests groupId={groupId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;
