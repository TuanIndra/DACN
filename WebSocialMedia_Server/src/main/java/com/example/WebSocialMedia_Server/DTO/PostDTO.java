package com.example.WebSocialMedia_Server.DTO;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostDTO {
    private Long id;
    private String content;
    private Long groupId; // Nếu cần
    private UserDTO user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<MediaDTO> mediaList;
    private int commentCount;
    // Thêm các trường cho thông tin chia sẻ
    private UserDTO sharedBy;          // Người chia sẻ
    private LocalDateTime sharedAt;    // Thời gian chia sẻ
    private String shareComment;       // Bình luận khi chia sẻ (nếu có)
}