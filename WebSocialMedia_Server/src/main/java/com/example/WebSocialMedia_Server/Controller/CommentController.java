package com.example.WebSocialMedia_Server.Controller;

import com.example.WebSocialMedia_Server.DTO.CommentDTO;
import com.example.WebSocialMedia_Server.Service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Tạo bình luận mới cho bài viết
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentDTO> createComment(
            @PathVariable Long postId,
            @RequestBody CommentDTO commentDTO,
            Authentication authentication) {

        String username = authentication.getName();
        CommentDTO createdComment = commentService.createComment(postId, commentDTO.getContent(), username);
        return ResponseEntity.ok(createdComment);
    }

    // Trả lời một bình luận
    @PostMapping("/comments/{commentId}/replies")
    public ResponseEntity<CommentDTO> replyToComment(
            @PathVariable Long commentId,
            @RequestBody CommentDTO commentDTO,
            Authentication authentication) {

        String username = authentication.getName();
        CommentDTO reply = commentService.replyToComment(commentId, commentDTO.getContent(), username);
        return ResponseEntity.ok(reply);
    }

    // Lấy danh sách bình luận của một bài viết
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<CommentDTO>> getCommentsByPostId(@PathVariable Long postId) {
        List<CommentDTO> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    // Các endpoint khác (xoá, sửa bình luận) nếu cần
}
