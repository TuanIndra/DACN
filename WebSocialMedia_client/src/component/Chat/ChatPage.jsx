import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getConversation, sendMessage, longPollMessages } from "../../api/messageApi";
import { fetchAcceptedFriends } from "../../api/friendshipApi";
import Navbar from "../Navbar/Navbar"; // Import Navbar đã setup sẵn
import FriendList from "./FriendList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";

const ChatPage = () => {
  const { receiverId } = useParams();
  const navigate = useNavigate();
  const senderId = localStorage.getItem("userId");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [friends, setFriends] = useState([]);
  const [receiverName, setReceiverName] = useState(""); // Lưu tên người nhận

  const fetchFriends = async () => {
    try {
      const response = await fetchAcceptedFriends();
      setFriends(response.data || []);
      // Tìm tên của người nhận từ danh sách bạn bè
      const receiver = response.data.find((friend) => friend.id.toString() === receiverId);
      if (receiver) {
        setReceiverName(receiver.fullName || "Người dùng");
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const fetchConversation = async () => {
    try {
      const data = await getConversation(receiverId, senderId);
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await sendMessage(senderId, receiverId, newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const pollMessages = async () => {
    try {
      const newMessages = await longPollMessages(senderId, receiverId);
      if (newMessages && newMessages.length > 0) {
        setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      }
      pollMessages();
    } catch (error) {
      console.error("Error polling messages:", error);
      setTimeout(pollMessages, 5000);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    if (senderId && receiverId) {
      fetchConversation();
      pollMessages();
    }
  }, [senderId, receiverId]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Main Chat Layout */}
      <div className="flex flex-1">
        {/* Sidebar Friend List */}
        <FriendList friends={friends} onFriendClick={(id) => navigate(`/chat/${id}`)} />

        {/* Chat Area */}
        <div className="flex-1 p-4 flex flex-col">
          
          <MessageList messages={messages} senderId={senderId} />
          <MessageInput
            newMessage={newMessage}
            onMessageChange={setNewMessage}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
