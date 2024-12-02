package com.example.WebSocialMedia_Server.DTO;

import com.example.WebSocialMedia_Server.Entity.NotificationType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDTO {
    private Long id;
    private NotificationType type;
    private Long referenceId;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private String message;
    private String actorName;
    private String actorAvatarUrl;
}
