// GroupPosts.jsx
import React, { useEffect, useState } from 'react';
import { isMember, getGroupPosts } from '../../api/groupApi';
import CreatePost from '../Home/CreatePost';
import GroupPostList from './GroupPostList';

const GroupPosts = ({ groupId }) => {
  const [posts, setPosts] = useState([]);
  const [userIsMember, setUserIsMember] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const memberResponse = await isMember(groupId);
        setUserIsMember(memberResponse.data);

        const postsResponse = await getGroupPosts(groupId);
        setPosts(postsResponse.data);
      } catch (error) {
        console.error('Error fetching group data or posts:', error);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setShowCreatePostModal(false);
  };

  return (
    <div>
    

     
      {/* Pass the posts to GroupPostList */}
      <GroupPostList posts={posts} />
    </div>
  );
};

export default GroupPosts;
