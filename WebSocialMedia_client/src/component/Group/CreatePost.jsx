// CreatePost.jsx
import React, { useState } from 'react';
import { createPost } from '../../api/postApi'; // Ensure you're using the correct API

const CreatePost = ({ groupId, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);

  const handleCreatePost = async () => {
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung bài viết');
      return;
    }

    const postData = {
      content,
      groupId: groupId ? Number(groupId) : null, // Ensure groupId is a number
    };

    const formData = new FormData();
    formData.append('post', JSON.stringify(postData)); // Adjusted to match backend expectations

    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await createPost(formData);
      const newPost = response.data;
      onPostCreated(newPost);
    } catch (error) {
      console.error('Lỗi khi tạo bài viết:', error);
      alert('Không thể tạo bài viết');
    }
  };

  return (
    <div>
      <textarea
        className="w-full h-32 p-2 border rounded dark:bg-gray-700 dark:text-white"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Bạn đang nghĩ gì?"
      />
      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
      />
      <button
        className="bg-primary text-white px-4 py-2 rounded mt-4 hover:bg-primary/90"
        onClick={handleCreatePost}
      >
        Đăng bài
      </button>
    </div>
  );
};

export default CreatePost;
