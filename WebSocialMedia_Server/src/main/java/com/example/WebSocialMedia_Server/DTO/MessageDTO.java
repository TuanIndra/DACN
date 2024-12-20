package com.example.WebSocialMedia_Server.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MessageDTO {
    private Long id;
    private Long senderId;
    private Long receiverId;
    private String content;
    private LocalDateTime createdAt;
    private String senderName; // Trường mới

    // Getter và Setter
    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }
    private String senderAvatarUrl; // Thêm trường cho avatar của người gửi
    private String receiverAvatarUrl; // Thêm trường cho avatar của người nhận
    private String receiverName;
}

