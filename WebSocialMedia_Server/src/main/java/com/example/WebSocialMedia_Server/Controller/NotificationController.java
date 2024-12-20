package com.example.WebSocialMedia_Server.Controller;

import com.example.WebSocialMedia_Server.DTO.NotificationDTO;
import com.example.WebSocialMedia_Server.Entity.NotificationType;
import com.example.WebSocialMedia_Server.Repository.UserRepository;
import com.example.WebSocialMedia_Server.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    // Lấy danh sách thông báo của người dùng
    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(Authentication authentication) {
        String username = authentication.getName();
        List<NotificationDTO> notifications = notificationService.getNotificationsByUser(username);
        return ResponseEntity.ok(notifications);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getUserNotificationsById(@PathVariable Long userId) {
        List<NotificationDTO> notifications = notificationService.getNotificationsByUserId(userId);
        return ResponseEntity.ok(notifications);
    }

    // Đánh dấu thông báo là đã đọc.
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<String> markNotificationAsRead(
            @PathVariable Long notificationId,
            Authentication authentication) {

        String username = authentication.getName();
        notificationService.markAsRead(notificationId, username);

        return ResponseEntity.ok("Notification marked as read successfully.");
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<String> deleteNotification(
            @PathVariable Long notificationId,
            Authentication authentication) {

        String username = authentication.getName();
        notificationService.deleteNotification(notificationId, username);

        return ResponseEntity.ok("Notification deleted successfully.");
    }
    @PostMapping
    public ResponseEntity<String> createNotification(
            @RequestParam Long recipientId,
            @RequestParam NotificationType type,
            @RequestParam Long referenceId) {
        notificationService.createNotification(recipientId, type, referenceId);
        return ResponseEntity.ok("Notification created successfully.");
    }
}

