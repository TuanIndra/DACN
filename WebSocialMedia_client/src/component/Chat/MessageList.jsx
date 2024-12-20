import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const getAvatarUrl = (avatarUrl) => {
  const defaultAvatarUrl = 'http://26.159.243.47:8082/uploads/default-avatar.png';

  if (!avatarUrl || avatarUrl === defaultAvatarUrl) {
    return defaultAvatarUrl;
  }

  const cleanedUrl = avatarUrl.replace(/\/{2,}/g, '/');
  const finalUrl = avatarUrl.startsWith('http')
    ? cleanedUrl
    : `http://26.159.243.47:8082/uploads${cleanedUrl.replace('/uploads', '')}`;
  return finalUrl;
};

const MessageList = ({ messages, senderId }) => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAvatarClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  // Lấy receiverName từ tin nhắn
  const receiverName = messages.find((msg) => msg.senderId !== Number(senderId))?.senderName || "Người dùng";

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Header: Tên người nhận */}
      <div className="bg-primary text-white p-4 rounded-t-lg shadow">
        <h1 className="text-lg font-bold">Tin nhắn với {receiverName}</h1>
      </div>

      {/* Danh sách tin nhắn */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4"
        style={{ maxHeight: "calc(5 * 80px)", minHeight: "400px" }}
      >
        {messages.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Chưa có tin nhắn nào.</p>
        ) : (
          <ul className="space-y-4">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className={`flex items-start gap-3 ${msg.senderId === Number(senderId) ? "justify-end" : "justify-start"
                  }`}
              >
                {/* Avatar */}
                {msg.senderId !== Number(senderId) && (
                  <img
                    src={getAvatarUrl(msg.senderAvatarUrl)}
                    alt={msg.senderName}
                    className="w-10 h-10 rounded-full border-2 border-primary object-cover cursor-pointer"
                    onClick={() => handleAvatarClick(msg.senderId)}
                  />
                )}
                {/* Nội dung tin nhắn */}
                <div
                  className={`p-2 rounded-lg max-w-[70%] ${msg.senderId === Number(senderId)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white"
                    }`}
                >
                  <p className="font-bold">
                    {msg.senderId === Number(senderId) ? "Bạn" : msg.senderName}
                  </p>
                  <p className="text-xl"> {msg.content}</p>
                 
                  <div className="text-xs mt-1 text-gray-500">
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MessageList;
