package com.example.WebSocialMedia_Server.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ShareDTO {
    private Long id;
    private UserDTO user;
    private PostDTO post;
    private LocalDateTime sharedAt;
    private String comment;
}
