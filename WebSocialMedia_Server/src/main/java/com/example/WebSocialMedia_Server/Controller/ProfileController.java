package com.example.WebSocialMedia_Server.Controller;

import com.example.WebSocialMedia_Server.DTO.PostDTO;
import com.example.WebSocialMedia_Server.DTO.UserDTO;
import com.example.WebSocialMedia_Server.Service.ProfileService;
import com.example.WebSocialMedia_Server.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private UserService userService;

    // Lấy thông tin trang cá nhân của người dùng (theo userId)
    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserProfile(@PathVariable Long userId) {
        UserDTO userDTO = profileService.getUserProfile(userId);
        return ResponseEntity.ok(userDTO);
    }

    // Lấy danh sách bài viết của người dùng (theo userId)
    @GetMapping("/{userId}/posts")
    public ResponseEntity<List<PostDTO>> getUserPosts(@PathVariable Long userId) {
        List<PostDTO> userPosts = profileService.getUserPosts(userId);
        return ResponseEntity.ok(userPosts);
    }

    // Lấy danh sách bạn bè của người dùng (theo userId)
    @GetMapping("/{userId}/friends")
    public ResponseEntity<List<UserDTO>> getUserFriends(@PathVariable Long userId) {
        List<UserDTO> userFriends = profileService.getUserFriends(userId);
        return ResponseEntity.ok(userFriends);
    }
}
