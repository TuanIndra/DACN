import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getConversation, sendMessageStomp } from '../../api/messageApi';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const MessagePage = () => {
  const { receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const stompClientRef = useRef(null);
  
  const currentUserId = localStorage.getItem('userId'); // ID user hiện tại

  useEffect(() => {
    if (!receiverId) {
      setError('Cần có receiverId để load hội thoại');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getConversation(receiverId);
        setMessages(data || []);
      } catch (err) {
        console.error('Error fetching conversation:', err);
        setError('Không thể tải hội thoại. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [receiverId]);

  useEffect(() => {
    // Kết nối STOMP
    const socket = new SockJS('http://localhost:8082/ws');
    const stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient;

    stompClient.connect({}, () => {
      console.log('Connected to WebSocket!');

      // Subscribe vào queue cá nhân để nhận tin nhắn
      stompClient.subscribe('/user/queue/messages', (message) => {
        const msgBody = JSON.parse(message.body);
        // Cập nhật UI với tin nhắn mới
        setMessages((prev) => [...prev, msgBody]);
      });
    }, (error) => {
      console.error('Error connecting STOMP:', error);
    });

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || !stompClientRef.current || !stompClientRef.current.connected) return;

    // Gửi tin nhắn qua STOMP
    sendMessageStomp(stompClientRef.current, receiverId, trimmedMessage);

    // Sau khi gửi tin, clear input
    setNewMessage('');
  };

  if (loading) return <p className="text-gray-600 dark:text-gray-400">Đang tải hội thoại...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg min-h-screen">
      {/* Header với tên người nhận (có thể điều chỉnh) */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Tin nhắn với User {receiverId}
      </h2>
      
      <div className="bg-gray-100 dark:bg-gray-700 p-4 mb-4 rounded-lg overflow-y-auto h-80 flex flex-col">
        {messages.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">Chưa có tin nhắn nào.</p>
        ) : (
          <ul className="space-y-2">
            {messages.map((msg, index) => (
              <li
                key={index}
                className={`p-2 rounded-lg max-w-[70%] break-words ${
                  msg.senderId === Number(currentUserId)
                    ? 'bg-blue-500 text-white self-end ml-auto'
                    : 'bg-gray-300 dark:bg-gray-600 dark:text-gray-200 self-start mr-auto'
                }`}
              >
                {msg.content}
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Form gửi tin nhắn */}
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          className="flex-grow p-2 border rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default MessagePage;
