package com.example.WebSocialMedia_Server.Service;

import com.example.WebSocialMedia_Server.DTO.MessageDTO;
import com.example.WebSocialMedia_Server.Entity.Message;
import com.example.WebSocialMedia_Server.Entity.User;
import com.example.WebSocialMedia_Server.Repository.MessageRepository;
import com.example.WebSocialMedia_Server.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public List<MessageDTO> getConversation(Long senderId, Long receiverId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        List<Message> messages = messageRepository.findConversation(sender, receiver);
        return messages.stream().map(this::convertToDTO).toList();
    }

    public MessageDTO sendMessage(Long senderId, Long receiverId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message msg = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .isRead(false)
                .build();

        msg = messageRepository.save(msg);
        return convertToDTO(msg);
    }

    // Lấy tin nhắn mới (chưa đọc) giữa hai user
    public List<MessageDTO> getNewMessages(Long userId, Long conversationId) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        User otherUser = userRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Other user not found"));

        List<Message> unreadMessages = messageRepository.findUnreadMessages(currentUser, otherUser);

        // Khi trả về, đánh dấu là đã đọc hoặc để client call api khác đánh dấu đọc
        // Ở đây ta có thể tự đánh dấu là đã đọc luôn
        for (Message m : unreadMessages) {
            m.setIsRead(true);
        }
        messageRepository.saveAll(unreadMessages);

        return unreadMessages.stream().map(this::convertToDTO).toList();
    }
    public Map<Long, Long> getUnreadMessagesCount(Long userId) {
        List<MessageRepository.UnreadMessagesCount> unreadCounts = messageRepository.countUnreadMessagesByUser(userId);

        // Chuyển đổi danh sách thành Map với key là `friendId` và value là `unreadMessages`
        return unreadCounts.stream()
                .collect(Collectors.toMap(MessageRepository.UnreadMessagesCount::getFriendId,
                        MessageRepository.UnreadMessagesCount::getUnreadMessages));
    }
    private MessageDTO convertToDTO(Message msg) {
        MessageDTO dto = new MessageDTO();
        dto.setId(msg.getId());
        dto.setSenderId(msg.getSender().getId());
        dto.setReceiverId(msg.getReceiver().getId());
        dto.setContent(msg.getContent());
        dto.setCreatedAt(msg.getCreatedAt());
        dto.setSenderName(msg.getSender().getFullName());
        dto.setReceiverName(msg.getReceiver().getFullName()); // Lấy tên của người nhận
        dto.setSenderAvatarUrl(msg.getSender().getAvatarUrl());
        dto.setReceiverAvatarUrl(msg.getReceiver().getAvatarUrl());
        return dto;
    }

}
