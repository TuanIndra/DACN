package com.example.WebSocialMedia_Server.Service;

import com.example.WebSocialMedia_Server.DTO.NotificationDTO;
import com.example.WebSocialMedia_Server.Entity.Notification;
import com.example.WebSocialMedia_Server.Entity.NotificationType;
import com.example.WebSocialMedia_Server.Entity.User;
import com.example.WebSocialMedia_Server.Repository.NotificationRepository;
import com.example.WebSocialMedia_Server.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Tạo thông báo mới.
     */
    @Transactional
    public Notification createNotification(Long recipientId, NotificationType type, Long referenceId) {
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        Notification notification = Notification.builder()
                .user(recipient)
                .type(type)
                .referenceId(referenceId)
                .isRead(false)
                .build();

        return notificationRepository.save(notification);
    }

    /**
     * Lấy danh sách thông báo của người dùng.
     */
    @Transactional(readOnly = true)
    public List<NotificationDTO> getNotificationsByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);

        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Đánh dấu thông báo là đã đọc.
     */
    @Transactional
    public void markAsRead(Long notificationId, String username) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to mark this notification as read");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    /**
     * Xóa thông báo.
     */
    @Transactional
    public void deleteNotification(Long notificationId, String username) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to delete this notification");
        }

        notificationRepository.delete(notification);
    }

    /**
     * Chuyển đổi Notification sang NotificationDTO.
     */
    public NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setId(notification.getId());
        notificationDTO.setType(NotificationType.valueOf(notification.getType().name()));
        notificationDTO.setReferenceId(notification.getReferenceId());
        notificationDTO.setIsRead(notification.getIsRead());
        notificationDTO.setCreatedAt(notification.getCreatedAt());

        // Lấy thông tin người gửi thông báo
        User sender = userRepository.findById(notification.getReferenceId())
                .orElse(null);

        if (sender != null) {
            notificationDTO.setActorName(sender.getFullName());
            notificationDTO.setActorAvatarUrl(sender.getAvatarUrl());
        } else {
            notificationDTO.setActorName("Unknown");
            notificationDTO.setActorAvatarUrl(null);
        }
        // Tạo nội dung thông báo
        notificationDTO.setMessage(generateMessage(notification));

        return notificationDTO;
    }

    private String generateMessage(Notification notification) {

        User actor = userRepository.findById(notification.getReferenceId())
                .orElse(null);
        switch (notification.getType()) {
            case FRIEND_REQUEST:
                return "Bạn có một yêu cầu kết bạn từ " + actor.getFullName() ;
            case LIKE:
                return actor.getFullName() + " đã thích bài viết của bạn";
            case COMMENT:
                return actor.getFullName()  + " đã bình luận về bài viết của bạn";
            case SHARE:
                return actor.getFullName()  + " đã chia sẻ bài viết của bạn";
            default:
                return "Bạn có một thông báo mới.";
        }
    }
}


