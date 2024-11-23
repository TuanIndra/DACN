import axiosInstance from '../utils/axiosConfig';

// Lấy danh sách bình luận theo bài viết
export const fetchCommentsByPostId = (postId) => {
  return axiosInstance.get(`/api/posts/${postId}/comments`);
};

// Tạo bình luận mới
export const createComment = (postId, commentData) => {
    return axiosInstance.post(`/api/posts/${postId}/comments`, commentData);
  };

// Trả lời bình luận
export const replyToComment = (commentId, replyData) => {
    return axiosInstance.post(`/api/comments/${commentId}/replies`, replyData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`, // Thêm token từ localStorage
      },
    });
  };

// Xóa bình luận (nếu cần)
export const deleteComment = (commentId) => {
  return axiosInstance.delete(`/api/comments/${commentId}`);
};

// Cập nhật bình luận (nếu cần)
export const updateComment = (commentId, newContent) => {
  return axiosInstance.put(`/api/comments/${commentId}`, { content: newContent });
};
export const fetchCommentCount = (postId) => {
    return axiosInstance.get(`/api/posts/${postId}/comments/count`);
  };
  
