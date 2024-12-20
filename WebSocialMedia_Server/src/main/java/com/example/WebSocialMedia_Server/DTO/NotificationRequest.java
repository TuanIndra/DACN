package com.example.WebSocialMedia_Server.DTO;

import lombok.Data;

@Data
public class NotificationRequest {
    private Long userId; // ID người nhận thông báo
    private String type; // Loại thông báo
    private Long referenceId; // ID tham chiếu
}