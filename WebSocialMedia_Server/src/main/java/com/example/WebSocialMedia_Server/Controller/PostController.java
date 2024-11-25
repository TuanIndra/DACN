package com.example.WebSocialMedia_Server.Controller;

import com.example.WebSocialMedia_Server.DTO.PostDTO;
import com.example.WebSocialMedia_Server.Entity.Post;
import com.example.WebSocialMedia_Server.Service.PostService;
import com.example.WebSocialMedia_Server.Service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;
    // Endpoint để lấy tất cả bài viết
    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllPosts() {
        List<PostDTO> allPosts = postService.getAllPosts();
        return ResponseEntity.ok(allPosts);
    }

    //đăng bài viết
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostDTO> createPost(
            @RequestParam("post") String postJson,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            Authentication authentication) throws JsonProcessingException {
        String username = authentication.getName();

        // Chuyển đổi postJson thành PostDTO
        ObjectMapper objectMapper = new ObjectMapper();
        PostDTO postDTO = objectMapper.readValue(postJson, PostDTO.class);

        Post createdPost = postService.createPost(postDTO, files, username);

        PostDTO responseDTO = postService.convertToDTO(createdPost);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    // Endpoint để lấy dòng thời gian của người dùng
    @GetMapping("/timeline")
    public ResponseEntity<List<PostDTO>> getUserTimeline(Authentication authentication) {
        String username = authentication.getName();
        Long userId = userService.findByUsername(username).getId();

        List<PostDTO> timelinePosts = postService.getUserTimeline(userId);
        return ResponseEntity.ok(timelinePosts);
    }
    // Endpoint để lấy news feed
    @GetMapping("/newsfeed")
    public ResponseEntity<List<PostDTO>> getNewsFeed(Authentication authentication) {
        String username = authentication.getName();
        Long userId = userService.findByUsername(username).getId();

        List<PostDTO> newsFeedPosts = postService.getNewsFeed(userId);
        return ResponseEntity.ok(newsFeedPosts);
    }
    // xóa bài viet
    @DeleteMapping("/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable Long postId, Authentication authentication) {
        String username = authentication.getName();

        try {
            postService.deletePost(postId, username);
            return ResponseEntity.ok("Post deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
    //Sửa bài viêt
    @PutMapping("/{postId}")
    public ResponseEntity<PostDTO> updatePost(
            @PathVariable Long postId,
            @RequestBody String updatedContent,
            Authentication authentication) {

        String username = authentication.getName();
        Post updatedPost = postService.updatePost(postId, updatedContent, username);

        // Chuyển đổi `Post` sang `PostDTO` (giả sử đã có convertToDTO trong PostService)
        PostDTO postDTO = postService.convertToDTO(updatedPost);

        return ResponseEntity.ok(postDTO);
    }
}

