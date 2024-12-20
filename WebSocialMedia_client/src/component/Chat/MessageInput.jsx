import React from "react";

const MessageInput = ({ newMessage, onMessageChange, onSendMessage }) => {
  return (
    <div className="flex space-x-2 mt-4">
      <input
        type="text"
        placeholder="Nhập tin nhắn..."
        className="flex-grow p-2 border rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        value={newMessage}
        onChange={(e) => onMessageChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSendMessage();
          }
        }}
      />
      <button
        onClick={onSendMessage}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
      >
        Gửi
      </button>
    </div>
  );
};

export default MessageInput;
