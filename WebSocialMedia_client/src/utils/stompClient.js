// src/utils/stompClient.js
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WEBSOCKET_URL = 'http://192.168.1.100:8082/ws'; // Thay IP và port cho phù hợp

let stompClient = null;

export const connectStomp = (onMessage) => {
  const socket = new SockJS(WEBSOCKET_URL);
  stompClient = Stomp.over(socket);
  stompClient.connect({}, () => {
    console.log('Connected to WebSocket!');
    // Subscribe vào queue cá nhân
    stompClient.subscribe('/user/queue/messages', (message) => {
      const msgBody = JSON.parse(message.body);
      console.log('Tin nhắn mới:', msgBody);
      if (onMessage) {
        onMessage(msgBody);
      }
    });
  }, (error) => {
    console.error('Error connecting STOMP:', error);
  });
};

export const sendMessage = (receiverId, content) => {
  if (stompClient && stompClient.connected) {
    stompClient.send('/app/message.send', {}, JSON.stringify({ receiverId, content }));
  }
};
