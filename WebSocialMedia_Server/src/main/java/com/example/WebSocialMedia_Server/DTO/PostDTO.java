package com.example.WebSocialMedia_Server.DTO;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostDTO {
    private Long id;
    private String content;
    private Long groupId;
    private String nameGroup;
    private UserDTO user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<MediaDTO> mediaList;
    private int commentCount;
    private int reactionCount;
    private UserDTO sharedBy;
    private LocalDateTime sharedAt;
    private String shareComment;
}