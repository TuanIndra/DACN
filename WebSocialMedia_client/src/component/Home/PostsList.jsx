import React, { useEffect, useState } from 'react';
import { fetchPosts, updatePost, deletePost } from '../../api/postApi';
import { fetchCommentsByPostId } from '../../api/commentApi';
import { getReactionsCountForPost } from '../../api/reactionApi';
import { getGroupDetails } from '../../api/groupApi';
import MediaDisplay from '../Post/MediaDisplay';
import PostHeader from './../Post/PostHeader';
import CommentSection from '../Post/CommentSection';
import ReactionButton from './ReactionButton';
import { useNavigate } from 'react-router-dom';

const PostsList = ({ onPostClick, userId }) => {
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [menuVisiblePostId, setMenuVisiblePostId] = useState(null);

  const loggedInUserId = Number(localStorage.getItem('userId'));
  const navigate = useNavigate();

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetchPosts();
        let sortedPosts = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        if (userId) {
          sortedPosts = sortedPosts.filter((post) => post.user?.id === userId);
        }

        const groupIds = [...new Set(sortedPosts.map(post => post.groupId).filter(Boolean))];
        const groupDetailsPromises = groupIds.map(groupId => getGroupDetails(groupId));
        const groupDetailsResponses = await Promise.all(groupDetailsPromises);

        const groupDetailsMap = {};
        groupDetailsResponses.forEach(response => {
          const group = response.data;
          groupDetailsMap[group.id] = group;
        });
        setGroups(groupDetailsMap);

        const postsWithDetails = await Promise.all(
          sortedPosts.map(async (post) => {
            try {
              const [commentsResponse, reactionsResponse] = await Promise.all([
                fetchCommentsByPostId(post.id),
                getReactionsCountForPost(post.id),
              ]);

              const latestComment = commentsResponse.data[0] || null;

              const totalComments = commentsResponse.data.reduce(
                (count, comment) => count + 1 + (comment.replies?.length || 0),
                0
              );

              const group = post.groupId ? groupDetailsMap[post.groupId] : null;

              return {
                ...post,
                totalComments,
                likeCount: reactionsResponse.data['LIKE'] || 0,
                latestComment,
                group,
              };
            } catch (error) {
              return { ...post, totalComments: 0, likeCount: 0, latestComment: null };
            }
          })
        );

        setPosts(postsWithDetails);
      } catch (err) {
        setError('Không thể tải danh sách bài viết');
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [userId]);

  const handleCommentClick = (post) => {
    navigate(`/post/${post.id}`, { state: { post } });
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleReactionChange = (postId, newHasLiked, newLikeCount) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, hasLiked: newHasLiked, likeCount: newLikeCount }
          : post
      )
    );
  };

  if (loading) return <p className="dark:text-gray-400 text-gray-600">Đang tải...</p>;
  if (error) return <p className="text-red-500 dark:text-red-400">{error}</p>;

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4"
        >
          {/* Header bài viết */}
          <PostHeader
            user={post.user}
            group={post.group} // Truyền thông tin nhóm vào PostHeader
            postId={post.id}
            createdAt={post.createdAt}
            isEditable={post.user?.id === loggedInUserId}
            onEdit={(id) => setEditingPostId(id)}
            onDelete={handleDeletePost}
            menuVisiblePostId={menuVisiblePostId}
            setMenuVisiblePostId={setMenuVisiblePostId}
          />

          {/* Nội dung bài viết */}
          <p className="text-gray-800 dark:text-gray-300 text-lg">{post.content}</p>

          {/* Media */}
          <MediaDisplay
            mediaList={post.mediaList}
            onMediaClick={(index) => onPostClick(post, index)}
          />

          {/* Latest comment */}
          {post.latestComment && (
            <div className="mt-4 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p className="text-lg font-semibold dark:text-gray-300 text-gray-700">
                {post.latestComment.username}:
              </p>
              <p className="text-md dark:text-gray-400 text-gray-600 mt-2">
                {post.latestComment.content}
              </p>
            </div>
          )}

          {/* Reactions and comments */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
            <ReactionButton
              postId={post.id}
              initialHasLiked={post.hasLiked}
              initialLikeCount={post.likeCount}
              onReactionChange={handleReactionChange}
            />
            <span
              className="cursor-pointer hover:underline"
              onClick={() => handleCommentClick(post)}
            >
              {post.totalComments || 0} Bình luận
            </span>
          </div>

          {/* Comment Section */}
          <CommentSection
            postId={post.id}
            totalComments={post.totalComments}
          />
        </div>
      ))}
    </div>
  );
};

export default PostsList;
