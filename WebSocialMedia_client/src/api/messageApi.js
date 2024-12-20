import axiosInstance from '../utils/axiosConfig';

// Gửi tin nhắn
export const sendMessage = async (senderId, receiverId, content) => {
  const response = await axiosInstance.post(
    `/api/messages/send?senderId=${senderId}&receiverId=${receiverId}&content=${encodeURIComponent(content)}`
  );
  return response.data;
};

// Lấy toàn bộ hội thoại (không bắt buộc, nếu cần)
export const getConversation = async (receiverId, senderId) => {
  const response = await axiosInstance.get(`/api/messages/conversation/${receiverId}`, {
    params: { senderId }
  });
  return response.data;
};

// Long poll để nhận tin nhắn mới
export const longPollMessages = async (senderId, receiverId) => {
  const response = await axiosInstance.get(`/api/messages/long-poll`, {
    params: { senderId, receiverId },
  });
  return response.data;
};
