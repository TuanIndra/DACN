package com.example.WebSocialMedia_Server.Controller;

import com.example.WebSocialMedia_Server.DTO.MessageDTO;
import com.example.WebSocialMedia_Server.DTO.SendMessageRequest;
import com.example.WebSocialMedia_Server.Entity.User;
import com.example.WebSocialMedia_Server.Repository.UserRepository;
import com.example.WebSocialMedia_Server.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final UserRepository userRepository;

    // Gửi tin nhắn
    @PostMapping("/send")
    public ResponseEntity<MessageDTO> sendMessage(@RequestBody SendMessageRequest request, Authentication authentication) {
        String username = authentication.getName();
        User sender = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        MessageDTO messageDTO = messageService.sendMessage(sender.getId(), request.getReceiverId(), request.getContent());

        return ResponseEntity.ok(messageDTO);
    }

    // Lấy lịch sử tin nhắn giữa hai người dùng
    @GetMapping("/conversation/{userId}")
    public ResponseEntity<List<MessageDTO>> getConversation(@PathVariable Long userId, Authentication authentication) {
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<MessageDTO> messages = messageService.getConversation(currentUser.getId(), userId);

        return ResponseEntity.ok(messages);
    }

    // Đánh dấu tin nhắn là đã đọc
    @PutMapping("/{messageId}/read")
    public ResponseEntity<String> markAsRead(@PathVariable Long messageId, Authentication authentication) {
        String username = authentication.getName();
        User receiver = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        messageService.markAsRead(messageId, receiver.getId());

        return ResponseEntity.ok("Message marked as read.");
    }
}

