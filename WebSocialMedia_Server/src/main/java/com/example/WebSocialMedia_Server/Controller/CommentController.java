package com.example.WebSocialMedia_Server.Controller;

import com.example.WebSocialMedia_Server.DTO.CommentDTO;
import com.example.WebSocialMedia_Server.Entity.Comment;
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
    @PostMapping("comments/{commentId}/replies")
    public ResponseEntity<CommentDTO> replyToComment(
            @PathVariable Long commentId,
            @RequestBody CommentDTO commentDTO,
            Authentication authentication) {

        String username = authentication.getName();
        CommentDTO reply = commentService.replyToComment(commentId, commentDTO.getContent(), username);
        return ResponseEntity.ok(reply);
    }

    // Lấy danh sách bình luận của một bài viết
    @GetMapping("posts/{postId}/comments")
    public ResponseEntity<List<CommentDTO>> getCommentsByPostId(
            @PathVariable Long postId,
            Authentication authentication) {

        // Lấy tên người dùng từ token JWT
        String username = authentication.getName();

        // Gọi service để lấy danh sách bình luận
        List<CommentDTO> comments = commentService.getCommentsByPostId(postId, username);

        // Trả về kết quả
        return ResponseEntity.ok(comments);
    }
    // dem binh luan
    @GetMapping("/posts/{postId}/comments/count")
    public ResponseEntity<Integer> getCommentCountByPostId(@PathVariable Long postId) {
        int count = commentService.countCommentsByPostId(postId);
        return ResponseEntity.ok(count);
    }
    //sua comment
    @PutMapping("comments/{commentId}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long commentId,
            @RequestBody CommentDTO commentDTO,
            Authentication authentication) {

        String username = authentication.getName();

        // Gửi nội dung cần cập nhật tới service
        Comment updatedComment = commentService.updateComment(commentId, commentDTO.getContent(), username);

        // Chuyển đổi đối tượng `Comment` sang `CommentDTO` để trả về
        CommentDTO updatedCommentDTO = commentService.convertToDTO(updatedComment);

        return ResponseEntity.ok(updatedCommentDTO);
    }
}
