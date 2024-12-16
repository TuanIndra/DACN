// src/api/messageApi.js
import axiosInstance from '../utils/axiosConfig';

// Lấy lịch sử tin nhắn
export const getConversation = async (userId) => {
  const response = await axiosInstance.get(`/api/messages/conversation/${userId}`);
  return response.data;
};

// Gửi tin nhắn qua STOMP
export const sendMessageStomp = (stompClient, receiverId, content) => {
  // payload: {receiverId, content}
  stompClient.send('/app/message.send', {}, JSON.stringify({ receiverId, content }));
};
