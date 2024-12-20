package com.example.WebSocialMedia_Server.Controller;

import com.example.WebSocialMedia_Server.DTO.PostDTO;
import com.example.WebSocialMedia_Server.Entity.Group;
import com.example.WebSocialMedia_Server.Entity.Post;
import com.example.WebSocialMedia_Server.Repository.GroupRepository;
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
    private GroupRepository groupRepository;

    @Autowired
    private UserService userService;
    // Endpoint để lấy tất cả bài viết cong khai
    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllPosts() {
        List<PostDTO> allPosts = postService.getAllPosts();
        return ResponseEntity.ok(allPosts);
    }

    //lay cac bai viet thuoc nhom private va secret cho thanh vien
    @GetMapping("/private-timeline")
    public ResponseEntity<List<PostDTO>> getPrivateAndSecretTimeline(Authentication authentication) {
        String username = authentication.getName();
        List<PostDTO> posts = postService.getPostsByPrivateOrSecretGroups(username);
        return ResponseEntity.ok(posts);
    }

    //đăng bài viết
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostDTO> createPost(
            @RequestPart("post") String postJson,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            Authentication authentication) throws JsonProcessingException {
        String username = authentication.getName();

        // Chuyển đổi postJson thành PostDTO
        ObjectMapper objectMapper = new ObjectMapper();
        PostDTO postDTO = objectMapper.readValue(postJson, PostDTO.class);

        // Kiểm tra nếu có `groupId`, ánh xạ nhóm
        if (postDTO.getGroupId() != null) {
            Group group = groupRepository.findById(postDTO.getGroupId())
                    .orElseThrow(() -> new RuntimeException("Group not found"));
            postDTO.setNameGroup(group.getName());
        }

        Post createdPost = postService.createPost(postDTO, files, username);

        PostDTO responseDTO = postService.convertToDTO(createdPost);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
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

