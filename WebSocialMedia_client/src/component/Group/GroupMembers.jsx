import React, { useEffect, useState } from 'react';
import { getGroupMembers } from '../../api/groupApi';

const GroupMembers = ({ groupId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAvatarUrl = (avatarUrl) => {
    const defaultAvatarUrl = 'http://localhost:8082/uploads/default-avatar.png';
    if (!avatarUrl || avatarUrl === defaultAvatarUrl) {
      return defaultAvatarUrl;
    }
    const cleanedUrl = avatarUrl.replace(/\/{2,}/g, '/');
    return avatarUrl.startsWith('http')
      ? cleanedUrl
      : `http://localhost:8082/uploads${cleanedUrl.replace('/uploads', '')}`;
  };

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const response = await getGroupMembers(groupId);
        setMembers(response.data || []);
      } catch (error) {
        console.error('Error fetching group members:', error);
        setError('Không thể tải danh sách thành viên.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [groupId]);

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400">Đang tải thành viên...</p>;
  }

  if (error) {
    return <p className="text-red-500 dark:text-red-400">{error}</p>;
  }

  if (!members.length) {
    return <p className="text-gray-500 dark:text-gray-400">Không có thành viên nào.</p>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-2xl font-bold mb-4 text-center text-primary dark:text-white">
        Thành viên nhóm
      </h3>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {members.map((member) => (
          <li key={member.id} className="py-4 flex items-center">
            {/* Avatar */}
            <img
              src={getAvatarUrl(member.avatarUrl)}
              alt={member.fullName || 'Người dùng ẩn danh'}
              className="w-14 h-14 rounded-full object-cover mr-4 border shadow"
            />
            {/* Thông tin */}
            <div>
              <p className="font-semibold text-lg dark:text-white">
                {member.fullName || 'Người dùng ẩn danh'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                @{member.username || 'Không có tên đăng nhập'}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupMembers;
