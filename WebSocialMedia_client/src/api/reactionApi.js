// src/api/reactionApi.js

import axiosInstance from '../utils/axiosConfig';

// Add or update a reaction for a post
export const reactToPost = (postId, reactionType) => {
  return axiosInstance.post(`/api/reactions/posts/${postId}`, null, {
    params: { reactionType },
  });
};

// Add or update a reaction for a comment
export const reactToComment = (commentId, reactionType) => {
  return axiosInstance.post(`/api/reactions/comments/${commentId}`, null, {
    params: { reactionType },
  });
};

// Remove a reaction from a post
export const removeReactionFromPost = (postId) => {
  return axiosInstance.delete(`/api/reactions/posts/${postId}`);
};

// Remove a reaction from a comment
export const removeReactionFromComment = (commentId) => {
  return axiosInstance.delete(`/api/reactions/comments/${commentId}`);
};

// Get reactions count for a post
export const getReactionsCountForPost = (postId) => {
  return axiosInstance.get(`/api/reactions/posts/${postId}/counts`);
};

// Get detailed reactions and user reaction for a post
export const fetchPostReactions = (postId) => {
  return axiosInstance.get(`/api/reactions/posts/${postId}`);
};

// Get reactions count for a comment
export const getReactionsCountForComment = (commentId) => {
  return axiosInstance.get(`/api/reactions/comments/${commentId}/counts`);
};

// Check if the user has reacted to a post
export const hasUserLikedPost = (postId) => {
  return axiosInstance.get(`/api/reactions/posts/${postId}/status`);
};
