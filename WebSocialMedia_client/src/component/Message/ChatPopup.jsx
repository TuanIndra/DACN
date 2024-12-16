import React, { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getConversation } from '../../api/messageApi';

const ChatPopup = ({ friend, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const stompClientRef = useRef(null);
  const currentUserId = localStorage.getItem('userId'); // Current user ID

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const data = await getConversation(friend.id);
        setMessages(data || []);
      } catch (error) {
        console.error('Error loading conversation:', error);
      }
    };

    fetchConversation();

    // WebSocket Connection
    const socket = new SockJS('http://localhost:8082/ws');
    const stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient;

    stompClient.connect({}, () => {
      console.log('Connected to WebSocket!');
      stompClient.subscribe('/user/queue/messages', (message) => {
        const msgBody = JSON.parse(message.body);
        setMessages((prev) => [...prev, msgBody]);
      });
    });

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.disconnect();
      }
    };
  }, [friend.id]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    stompClientRef.current.send(
      '/app/message.send',
      {},
      JSON.stringify({
        receiverId: friend.id,
        content: newMessage.trim(),
      })
    );

    setNewMessage('');
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center p-4 bg-primary text-white rounded-t-lg">
        <h2 className="text-lg font-bold">{friend.fullName}</h2>
        <button onClick={onClose} className="text-white text-xl">×</button>
      </div>
      <div className="p-4 overflow-y-auto h-60">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg mb-2 ${
              msg.senderId === Number(currentUserId)
                ? 'bg-blue-500 text-white ml-auto max-w-[80%]'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 max-w-[80%]'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex items-center p-2 border-t dark:border-gray-700">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-2 border rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none"
          placeholder="Nhập tin nhắn..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatPopup;
