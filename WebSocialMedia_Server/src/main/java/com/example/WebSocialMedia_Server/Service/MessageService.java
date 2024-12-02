package com.example.WebSocialMedia_Server.Service;

import com.example.WebSocialMedia_Server.DTO.MessageDTO;
import com.example.WebSocialMedia_Server.Entity.Message;
import com.example.WebSocialMedia_Server.Entity.User;
import com.example.WebSocialMedia_Server.Repository.MessageRepository;
import com.example.WebSocialMedia_Server.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    // Gửi tin nhắn
    @Transactional
    public MessageDTO sendMessage(Long senderId, Long receiverId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .isRead(false)
                .build();

        message = messageRepository.save(message);

        return convertToDTO(message);
    }

    // Lấy lịch sử tin nhắn giữa hai người dùng
    @Transactional(readOnly = true)
    public List<MessageDTO> getConversation(Long userId1, Long userId2) {
        List<Message> messages = messageRepository.findConversation(userId1, userId2);
        return messages.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Đánh dấu tin nhắn là đã đọc
    @Transactional
    public void markAsRead(Long messageId, Long receiverId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!message.getReceiver().getId().equals(receiverId)) {
            throw new RuntimeException("You are not authorized to mark this message as read");
        }

        message.setIsRead(true);
        messageRepository.save(message);
    }

    // Chuyển đổi Message sang MessageDTO
    private MessageDTO convertToDTO(Message message) {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setContent(message.getContent());
        dto.setIsRead(message.getIsRead());
        dto.setCreatedAt(message.getCreatedAt());

        User sender = message.getSender();
        dto.setSenderId(sender.getId());
        dto.setSenderName(sender.getFullName());
        dto.setSenderAvatarUrl(sender.getAvatarUrl());

        User receiver = message.getReceiver();
        dto.setReceiverId(receiver.getId());
        dto.setReceiverName(receiver.getFullName());
        dto.setReceiverAvatarUrl(receiver.getAvatarUrl());

        return dto;
    }
}

