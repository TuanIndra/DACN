import axiosInstance from '../utils/axiosConfig';

// Lấy danh sách bài viết
export const fetchPosts = () => {
  return axiosInstance.get('/api/posts');
};

// Tạo bài viết mới
export const createPost = (formData) => {
  return axiosInstance.post('/api/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Lấy chi tiết bài viết
export const getPostById = (postId) => {
  return axiosInstance.get(`/api/posts/${postId}`); // Thêm dấu `/` trước postId
};

// Cập nhật bài viết
export const updatePost = (postId, updatedContent) => {
  return axiosInstance.put(`/api/posts/${postId}`, updatedContent, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Xóa bài viết
export const deletePost = (postId) => {
  return axiosInstance.delete(`/api/posts/${postId}`);
};