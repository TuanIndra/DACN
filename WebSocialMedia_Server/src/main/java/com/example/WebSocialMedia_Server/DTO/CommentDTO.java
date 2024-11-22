package com.example.WebSocialMedia_Server.DTO;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CommentDTO {
    private Long id;
    private Long postId;        // ID của bài viết
    private Long userId;        // ID của người dùng bình luận
    private String username;    // Tên người dùng
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CommentDTO> replies;  // Danh sách phản hồi (nếu có)
}

