package com.example.WebSocialMedia_Server.Controller;

import com.example.WebSocialMedia_Server.DTO.ShareDTO;
import com.example.WebSocialMedia_Server.Service.ShareService;
import com.example.WebSocialMedia_Server.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shares")
public class ShareController {

    @Autowired
    private ShareService shareService;

    @Autowired
    private UserService userService;

    // Endpoint để chia sẻ bài viết
    @PostMapping
    public ResponseEntity<ShareDTO> sharePost(
            @RequestParam("postId") Long postId,
            @RequestParam(value = "comment", required = false) String comment,
            Authentication authentication) {
        String username = authentication.getName();
        Long userId = userService.findByUsername(username).getId();

        ShareDTO shareDTO = shareService.sharePost(userId, postId, comment);
        return ResponseEntity.ok(shareDTO);
    }
}
