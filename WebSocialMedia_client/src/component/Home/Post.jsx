import React, { useState } from 'react';
import { updatePost, deletePost } from '../../api/postApi';
import Comments from '../Post/Comments';
import MediaDisplay from './../Post/MediaDisplay';
import ReactionButton from './../Post/ReactionButton';

const Post = ({ post, onPostClick, loggedInUserId, onPostUpdate, onPostDelete }) => {
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedPostContent, setEditedPostContent] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const handleUpdatePost = async (content) => {
    if (!content.trim()) return;
    try {
      await updatePost(post.id, content);
      onPostUpdate(post.id, content);
      setEditingPostId(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(post.id);
      onPostDelete(post.id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded p-4 mb-4">
      {/* User Info and Menu */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <img
            src={post.user?.avatarUrl ? `http://26.159.243.47:8082/uploads/${post.user.avatarUrl}` : `http://localhost:8082/uploads/default-avatar.png`}
            alt={post.user?.fullName || 'User'}
            className="w-10 h-10 rounded-full mr-3 cursor-pointer"
            onClick={() => onPostClick(post)}
          />
          <div>
            <h3 className="font-bold dark:text-white">{post.user?.fullName || 'Người dùng'}</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(post.createdAt).toLocaleString()}</span>
          </div>
        </div>
        {post.user?.id === loggedInUserId && (
          <div className="relative">
            <button
              className="text-gray-500 dark:text-gray-300 focus:outline-none"
              onClick={() => setMenuVisible((prev) => !prev)}
            >
              ⋮
            </button>
            {menuVisible && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border rounded shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setEditingPostId(post.id)}
                >
                  Chỉnh sửa
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleDeletePost}
                >
                  Xóa
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      {editingPostId === post.id ? (
        <div>
          <textarea
            value={editedPostContent}
            onChange={(e) => setEditedPostContent(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <div className="mt-2 flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => handleUpdatePost(editedPostContent)}
            >
              Lưu
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setEditingPostId(null)}
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <p className="dark:text-gray-300">{post.content}</p>
      )}

      {/* Media */}
      <MediaDisplay mediaList={post.mediaList} onPostClick={onPostClick} />

      {/* Stats */}
      <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400">
        <ReactionButton postId={post.id} initialReactions={post.reactions} />
        <span className="mr-4">{post.totalComments || 0} Bình luận</span>
        <span>{post.shares?.length || 0} Chia sẻ</span>
      </div>

      {/* Comments */}
      {/*<Comments postId={post.id} latestComment={post.latestComment} />*/}
    </div>
  );
};

export default Post;
