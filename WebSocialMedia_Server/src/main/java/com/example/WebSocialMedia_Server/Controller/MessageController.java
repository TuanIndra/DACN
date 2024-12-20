package com.example.WebSocialMedia_Server.Controller;

import com.example.WebSocialMedia_Server.DTO.MessageDTO;
import com.example.WebSocialMedia_Server.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    // API để lấy lịch sử tin nhắn giữa hai người dùng
    @GetMapping("/conversation/{receiverId}")
    public ResponseEntity<List<MessageDTO>> getConversation(
            @PathVariable Long receiverId,
            @RequestParam Long senderId) {
        List<MessageDTO> messages = messageService.getConversation(senderId, receiverId);
        return ResponseEntity.ok(messages);
    }

    // API gửi tin nhắn
    @PostMapping("/send")
    public ResponseEntity<MessageDTO> sendMessage(
            @RequestParam Long senderId,
            @RequestParam Long receiverId,
            @RequestParam String content) {
        MessageDTO messageDTO = messageService.sendMessage(senderId, receiverId, content);
        return ResponseEntity.ok(messageDTO);
    }

    // API long-polling để kiểm tra tin nhắn mới
    @GetMapping("/long-poll")
    public ResponseEntity<List<MessageDTO>> longPoll(
            @RequestParam Long senderId,
            @RequestParam Long receiverId) {

        long startTime = System.currentTimeMillis();
        long timeout = 30000; // Thời gian chờ tối đa (30 giây)
        List<MessageDTO> newMessages;

        do {
            // Lấy tin nhắn chưa đọc giữa sender và receiver
            newMessages = messageService.getNewMessages(senderId, receiverId);

            if (!newMessages.isEmpty()) {
                return ResponseEntity.ok(newMessages);
            }

            // Chờ 1 giây trước khi thử lại
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return ResponseEntity.noContent().build();
            }
        } while (System.currentTimeMillis() - startTime < timeout);

        // Không có tin nhắn mới trong khoảng thời gian timeout
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/unread-count/{userId}")
    public ResponseEntity<Map<Long, Long>> getUnreadMessagesCount(@PathVariable Long userId) {
        Map<Long, Long> unreadCounts = messageService.getUnreadMessagesCount(userId);
        return ResponseEntity.ok(unreadCounts);
    }
}
