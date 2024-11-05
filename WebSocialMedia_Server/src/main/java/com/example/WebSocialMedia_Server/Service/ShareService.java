package com.example.WebSocialMedia_Server.Service;

import com.example.WebSocialMedia_Server.DTO.ShareDTO;
import com.example.WebSocialMedia_Server.DTO.PostDTO;
import com.example.WebSocialMedia_Server.DTO.UserDTO;
import com.example.WebSocialMedia_Server.Entity.Share;
import com.example.WebSocialMedia_Server.Entity.Post;
import com.example.WebSocialMedia_Server.Entity.User;
import com.example.WebSocialMedia_Server.Repository.ShareRepository;
import com.example.WebSocialMedia_Server.Repository.PostRepository;
import com.example.WebSocialMedia_Server.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ShareService {

    @Autowired
    private ShareRepository shareRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostService postService; // Nếu cần chuyển đổi Post sang PostDTO

    @Autowired
    private UserService userService; // Nếu cần chuyển đổi User sang UserDTO

    // Chia sẻ bài viết với bình luận
    @Transactional
    public ShareDTO sharePost(Long userId, Long postId, String comment) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Tạo đối tượng Share
        Share share = Share.builder()
                .user(user)
                .post(post)
                .comment(comment)
                .build();

        share = shareRepository.save(share);

        return convertToDTO(share);
    }

    // Phương thức chuyển đổi Share sang ShareDTO
    public ShareDTO convertToDTO(Share share) {
        ShareDTO shareDTO = new ShareDTO();
        shareDTO.setId(share.getId());
        shareDTO.setSharedAt(share.getSharedAt());
        shareDTO.setComment(share.getComment());

        UserDTO userDTO = userService.convertToDTO(share.getUser());
        shareDTO.setUser(userDTO);

        PostDTO postDTO = postService.convertToDTO(share.getPost());
        shareDTO.setPost(postDTO);

        return shareDTO;
    }

}
