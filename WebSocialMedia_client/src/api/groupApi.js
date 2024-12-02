// src/api/groupApi.js
import axiosInstance from '../utils/axiosConfig';

// Create a new group
export const createGroup = (groupData, imageFile) => {
  const formData = new FormData();
  formData.append('group', JSON.stringify(groupData));
  if (imageFile) formData.append('imageFile', imageFile);

  return axiosInstance.post('/api/groups', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const createPost = (groupId, postData) => {
  return axiosInstance.post(`/api/groups/${groupId}/posts`, postData);
};
export const getAllGroups = () => {
    return axiosInstance.get('/api/groups');
  };
  export const getGroupDetails = (groupId) => {
    return axiosInstance.get(`/api/groups/${groupId}`);
  };
  
// Request to join a group
export const requestToJoinGroup = (groupId) => {
  return axiosInstance.post(`/api/groups/${groupId}/request`);
};
// Hàm kiểm tra xem người dùng có phải là thành viên nhóm không
export const isMember = (groupId) => {
    return axiosInstance.get(`/api/groups/${groupId}/is-member`);
  };
// Handle membership request (accept or reject)
export const handleMembershipRequest = async (groupId, memberId, action) => {
    const response = await axiosInstance.put(`/api/groups/${groupId}/members/${memberId}/handle`, null, {
      params: { action },
    });
    return response;
  };
// Kiểm tra xem người dùng có phải admin không
export const isAdminOfGroup = (groupId) => {
    return axiosInstance.get(`/api/groups/${groupId}/is-admin`);
  };
// Get pending requests
export const getPendingRequests = (groupId) => {
  return axiosInstance.get(`/api/groups/${groupId}/requests`);
};

// Get group members
export const getGroupMembers = (groupId) => {
  return axiosInstance.get(`/api/groups/${groupId}/members`);
};

// Get rejected requests
export const getRejectedRequests = (groupId) => {
  return axiosInstance.get(`/api/groups/${groupId}/rejected`);
};

// Add member to group
export const addMemberToGroup = (groupId, memberUsername) => {
  return axiosInstance.post(`/api/groups/${groupId}/addMember`, null, {
    params: { memberUsername },
  });
};

// Change member status
export const changeMemberStatus = (groupId, memberId, action) => {
  return axiosInstance.put(`/api/groups/${groupId}/members/${memberId}/change-status`, null, {
    params: { action },
  });
};

// Remove member from group
export const removeMemberFromGroup = (groupId, memberUsername) => {
  return axiosInstance.delete(`/api/groups/${groupId}/members`, {
    params: { memberUsername },
  });
};

// Leave group
export const leaveGroup = (groupId) => {
  return axiosInstance.post(`/api/groups/${groupId}/leave`);
};

// Get group posts
export const getGroupPosts = (groupId) => {
  return axiosInstance.get(`/api/groups/${groupId}/posts`);
};

// Update group
export const updateGroup = (groupId, groupData) => {
  return axiosInstance.put(`/api/groups/${groupId}`, groupData);
};

// Delete group
export const deleteGroup = (groupId) => {
  return axiosInstance.delete(`/api/groups/${groupId}`);
};
