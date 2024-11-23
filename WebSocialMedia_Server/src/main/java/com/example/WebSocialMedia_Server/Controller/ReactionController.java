package com.example.WebSocialMedia_Server.Controller;

import com.example.WebSocialMedia_Server.Entity.ReactionType;
import com.example.WebSocialMedia_Server.Service.ReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reactions")
public class ReactionController {

    @Autowired
    private ReactionService reactionService;

    // Thêm hoặc cập nhật reaction cho bài viết
    @PostMapping("/posts/{postId}")
    public ResponseEntity<String> reactToPost(
            @PathVariable Long postId,
            @RequestParam ReactionType reactionType,
            Authentication authentication) {

        String username = authentication.getName();
        reactionService.reactToPost(postId, username, reactionType);
        return ResponseEntity.ok("Reaction added/updated successfully");
    }

    // Thêm hoặc cập nhật reaction cho bình luận
    @PostMapping("/comments/{commentId}")
    public ResponseEntity<String> reactToComment(
            @PathVariable Long commentId,
            @RequestParam ReactionType reactionType,
            Authentication authentication) {

        String username = authentication.getName();
        reactionService.reactToComment(commentId, username, reactionType);
        return ResponseEntity.ok("Reaction added/updated successfully");
    }

    // Xóa reaction khỏi bài viết
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<String> removeReactionFromPost(
            @PathVariable Long postId,
            Authentication authentication) {

        String username = authentication.getName();
        reactionService.removeReactionFromPost(postId, username);
        return ResponseEntity.ok("Reaction removed successfully");
    }

    // Xóa reaction khỏi bình luận
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<String> removeReactionFromComment(
            @PathVariable Long commentId,
            Authentication authentication) {

        String username = authentication.getName();
        reactionService.removeReactionFromComment(commentId, username);
        return ResponseEntity.ok("Reaction removed successfully");
    }

    // Lấy số lượng reactions cho bài viết
    @GetMapping("/posts/{postId}/counts")
    public ResponseEntity<Map<ReactionType, Long>> getReactionsCountForPost(@PathVariable Long postId) {
        Map<ReactionType, Long> counts = reactionService.countReactionsForPost(postId);
        return ResponseEntity.ok(counts);
    }

    // Lấy số lượng reactions cho bình luận
    @GetMapping("/comments/{commentId}/counts")
    public ResponseEntity<Map<ReactionType, Long>> getReactionsCountForComment(@PathVariable Long commentId) {
        Map<ReactionType, Long> counts = reactionService.countReactionsForComment(commentId);
        return ResponseEntity.ok(counts);
    }
}
