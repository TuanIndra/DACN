import React, { useEffect, useState } from 'react';
import { getGroupPosts,getGroupDetails  } from '../../api/groupApi';
import PostHeader from './PostHeader';
import MediaDisplay from '../Post/MediaDisplay';
import CommentSection from '../Post/CommentSection';
import ReactionButton from '../Home/ReactionButton';
import { useNavigate } from 'react-router-dom';

const GroupMemberPostList = ({ groupId }) => {
    const [posts, setPosts] = useState([]);
    const [groupName, setGroupName] = useState(''); // State for group name
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchGroupData = async () => {
        try {
          // Fetch group details to get the group name
          const groupResponse = await getGroupDetails(groupId);
          const groupName = groupResponse.data.name;
          setGroupName(groupName);
  
          // Fetch posts for the group
          const postsResponse = await getGroupPosts(groupId);
          console.log('Group Posts API Response:', postsResponse.data);
  
          const filteredPosts = postsResponse.data.filter(
            (post) => post.groupId && post.groupId.toString() === groupId
          );
  
          console.log('Filtered Posts:', filteredPosts);
          setPosts(filteredPosts);
        } catch (error) {
          console.error('Error fetching group posts or details:', error);
          setError('Không thể tải danh sách bài viết trong nhóm.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchGroupData();
    }, [groupId]);
  
    if (loading) {
      return <p>Đang tải bài viết...</p>;
    }
  
    if (error) {
      return <p className="text-red-500 dark:text-red-400">{error}</p>;
    }
  
    if (posts.length === 0) {
      return <p>Không có bài viết nào trong nhóm này.</p>;
    }
  
    return (
      <div>
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-800 shadow-md rounded p-4 mb-4"
            onClick={() =>
              navigate(`/post/${post.id}`, { state: { post } })
            }
          >
            <PostHeader
              user={post.user}
              groupName={groupName} // Pass the group name
              createdAt={post.createdAt}
            />
            <p className="dark:text-gray-300">{post.content}</p>
            <MediaDisplay mediaList={post.mediaList} />
            <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400">
              <ReactionButton
                postId={post.id}
                initialHasLiked={post.hasLiked}
                initialLikeCount={post.reactionCount || 0}
              />
              <span className="ml-4 cursor-pointer">
                {post.commentCount || 0} Bình luận
              </span>
            </div>
            <CommentSection postId={post.id} totalComments={post.commentCount} />
          </div>
        ))}
      </div>
    );
  };
  
  export default GroupMemberPostList;
  
