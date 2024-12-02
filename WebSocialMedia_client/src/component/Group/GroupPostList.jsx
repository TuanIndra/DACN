import React, { useEffect, useState } from 'react';
import { isMember, getGroupPosts } from '../../api/groupApi';
import CreatePost from '../Group/CreatePost'; // Component tạo bài viết
import GroupMemberPostList from './GroupMemberPostList'; // Component hiển thị danh sách bài viết
import { useParams } from 'react-router-dom';

const GroupPostList = () => {
  const { groupId } = useParams(); // Lấy groupId từ URL
  const [posts, setPosts] = useState([]);
  const [userIsMember, setUserIsMember] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        // Kiểm tra xem người dùng có phải là thành viên của nhóm không
        const memberResponse = await isMember(groupId);
        setUserIsMember(memberResponse.data);

        if (memberResponse.data) {
          // Nếu là thành viên, lấy danh sách bài viết của nhóm
          const postsResponse = await getGroupPosts(groupId);

          // Lọc các bài viết có groupId khớp với groupId hiện tại và không bị null
          const filteredPosts = postsResponse.data.filter(
            (post) => post.groupId && post.groupId.toString() === groupId
          );

          setPosts(filteredPosts);
        } else {
          // Không phải thành viên, không hiển thị bài viết
          setPosts([]);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu nhóm:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const handlePostCreated = (newPost) => {
    // Thêm bài viết mới vào đầu danh sách
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setShowCreatePostModal(false);
  };

  if (loadingPosts) {
    return <p className="text-center text-gray-500 dark:text-gray-300">Đang tải bài viết...</p>;
  }

  if (!userIsMember) {
    return <p className="text-center text-red-500 dark:text-red-400">Bạn không phải là thành viên của nhóm này.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      {/* Tiêu đề với gạch dưới */}
      <h3 className="text-2xl font-bold mb-6 text-center text-primary dark:text-white underline decoration-primary">
        Bài viết của nhóm
      </h3>

      {/* Tabs điều hướng */}


      {/* Nút tạo bài viết */}
      {userIsMember && (
        <div className="flex justify-end mb-4">
          <button
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            onClick={() => setShowCreatePostModal(true)}
          >
            Tạo bài viết
          </button>
        </div>
      )}

      {/* Modal tạo bài viết */}
      {showCreatePostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[90%] max-w-xl p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white"
              onClick={() => setShowCreatePostModal(false)}
            >
              ✕
            </button>
            <CreatePost groupId={groupId} onPostCreated={handlePostCreated} />
          </div>
        </div>
      )}

      {/* Danh sách bài viết */}
      <GroupMemberPostList groupId={groupId} />
    </div>
  );
};

export default GroupPostList;
