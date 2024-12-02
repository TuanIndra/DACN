package com.example.WebSocialMedia_Server.Controller;

import com.example.WebSocialMedia_Server.DTO.CommentDTO;
import com.example.WebSocialMedia_Server.DTO.ShareDTO;
import com.example.WebSocialMedia_Server.Entity.ReactionType;
import com.example.WebSocialMedia_Server.Entity.Share;
import com.example.WebSocialMedia_Server.Service.CommentService;
import com.example.WebSocialMedia_Server.Service.ReactionService;
import com.example.WebSocialMedia_Server.Service.ShareService;
import com.example.WebSocialMedia_Server.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shares")
@RequiredArgsConstructor
public class ShareController {

    @Autowired
    private final ShareService shareService;

    @Autowired
    private UserService userService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private ReactionService reactionService;

    // Endpoint để chia sẻ bài viết
    @PostMapping("/{postId}")
    public ResponseEntity<ShareDTO> sharePost(
            @PathVariable Long postId,
            @RequestBody ShareDTO shareDTO,
            Authentication authentication) {

        String username = authentication.getName();
        Share share = shareService.sharePost(postId, username, shareDTO.getComment());

        // Chuyển đổi đối tượng Share sang ShareDTO
        ShareDTO responseDTO = shareService.convertToDTO(share);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @PostMapping("/{shareId}/comments")
    public ResponseEntity<CommentDTO> createCommentForShare(
            @PathVariable Long shareId,
            @RequestBody String content,
            Authentication authentication) {

        String username = authentication.getName();
        CommentDTO commentDTO = commentService.createCommentForShare(shareId, content, username);

        return ResponseEntity.status(HttpStatus.CREATED).body(commentDTO);
    }

    @PostMapping("/{shareId}/reactions")
    public ResponseEntity<String> reactToSharedPost(
            @PathVariable Long shareId,
            @RequestParam ReactionType reactionType,
            Authentication authentication) {

        String username = authentication.getName();
        reactionService.reactToSharedPost(shareId, username, reactionType);

        return ResponseEntity.ok("Reaction added successfully");
    }

    @GetMapping("/{shareId}/comments")
    public ResponseEntity<List<CommentDTO>> getCommentsForSharedPost(@PathVariable Long shareId) {
        List<CommentDTO> comments = commentService.getCommentsForSharedPost(shareId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/shares/{shareId}/reactions/count")
    public ResponseEntity<Integer> getReactionsCountForSharedPost(@PathVariable Long shareId) {
        int count = reactionService.getReactionsCountForSharedPost(shareId);
        return ResponseEntity.ok(count);
    }
}
