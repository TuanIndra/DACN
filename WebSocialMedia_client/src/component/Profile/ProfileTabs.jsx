import React, { useState, useEffect } from 'react';
import PostsList from '../../component/Home/PostsList';
import ProfileFriends from './ProfileFriends';
import { fetchAcceptedFriends } from '../../api/friendshipApi';

const ProfileTabs = ({ activeTab, setActiveTab, userId, navigate }) => {
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  useEffect(() => {
    if (activeTab === 'friends') {
      const fetchFriends = async () => {
        setLoadingFriends(true);
        try {
          const friendsResponse = await fetchAcceptedFriends(userId);
          setFriends(friendsResponse.data || []);
        } catch (error) {
          console.error('Error fetching friends:', error);
          setFriends([]);
        } finally {
          setLoadingFriends(false);
        }
      };

      fetchFriends();
    }
  }, [activeTab, userId]);

  return (
    <div className="w-full max-w-5xl mx-auto mt-6">
      {/* Tab Header */}
      <div className="flex justify-around border-b-2 pb-2">
        <button
          className={`px-6 py-2 transition-colors ${
            activeTab === 'posts'
              ? 'text-primary border-b-4 border-primary font-semibold'
              : 'text-gray-500 hover:text-primary'
          }`}
          onClick={() => setActiveTab('posts')}
        >
          Bài viết
        </button>
        <button
          className={`px-6 py-2 transition-colors ${
            activeTab === 'friends'
              ? 'text-primary border-b-4 border-primary font-semibold'
              : 'text-gray-500 hover:text-primary'
          }`}
          onClick={() => setActiveTab('friends')}
        >
          Bạn bè
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'posts' && (
          <PostsList
            userId={Number(userId)}
            onPostClick={(post, index) =>
              navigate(`/post/${post.id}`, { state: { post, currentImageIndex: index } })
            }
          />
        )}
        {activeTab === 'friends' && (
          <ProfileFriends
            userId={userId}
            friends={friends}
            loading={loadingFriends}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;
