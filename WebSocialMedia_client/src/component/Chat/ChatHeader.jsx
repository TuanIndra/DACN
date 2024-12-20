import React from "react";

const ChatHeader = ({ receiverName  }) => {
  return (
    <div className="bg-primary text-white p-4 rounded-lg shadow">
      <h1 className="text-lg font-bold">Tin nhắn với {receiverName}</h1>
    </div>
  );
};

export default ChatHeader;
