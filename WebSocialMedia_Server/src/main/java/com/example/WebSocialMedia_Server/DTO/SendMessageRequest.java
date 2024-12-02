package com.example.WebSocialMedia_Server.DTO;

import lombok.Data;

@Data
public class SendMessageRequest {
    private Long receiverId;
    private String content;
}

