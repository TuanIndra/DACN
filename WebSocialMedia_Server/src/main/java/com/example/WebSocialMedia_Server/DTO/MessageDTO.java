package com.example.WebSocialMedia_Server.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageDTO {
    private Long id;
    private Long senderId;
    private String senderName;
    private String senderAvatarUrl;
    private Long receiverId;
    private String receiverName;
    private String receiverAvatarUrl;
    private String content;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
