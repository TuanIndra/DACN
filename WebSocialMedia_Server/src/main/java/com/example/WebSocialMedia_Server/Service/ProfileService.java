package com.example.WebSocialMedia_Server.Service;

import com.example.WebSocialMedia_Server.DTO.PostDTO;
import com.example.WebSocialMedia_Server.DTO.UserDTO;
import com.example.WebSocialMedia_Server.Entity.Post;
import com.example.WebSocialMedia_Server.Entity.Share;
import com.example.WebSocialMedia_Server.Entity.User;
import com.example.WebSocialMedia_Server.Repository.PostRepository;
import com.example.WebSocialMedia_Server.Repository.ShareRepository;
import com.example.WebSocialMedia_Server.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ShareRepository shareRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private FriendshipService friendshipService;

    @Autowired
    private PostService postService;

    // Lấy thông tin người dùng
    public UserDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userService.convertToDTO(user);
    }

    // Lấy danh sách bài viết của người dùng (bao gồm bài viết tự đăng và bài viết đã chia sẻ)
    public List<PostDTO> getUserPosts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<PostDTO> userPosts = new ArrayList<>();

        // Lấy bài viết do người dùng tạo
        List<Post> posts = postRepository.findByUser(user);
        for (Post post : posts) {
            PostDTO postDTO = postService.convertToDTO(post);
            userPosts.add(postDTO);
        }

        // Lấy các bài viết mà người dùng đã chia sẻ
        List<Share> shares = shareRepository.findByUser(user);
        for (Share share : shares) {
            Post sharedPost = share.getPost();
            PostDTO postDTO = postService.convertToDTO(sharedPost);

            // Thêm thông tin về việc chia sẻ
            postDTO.setSharedBy(userService.convertToDTO(user));
            postDTO.setSharedAt(share.getSharedAt());
            postDTO.setShareComment(share.getComment());

            userPosts.add(postDTO);
        }

        // Sắp xếp danh sách bài viết theo thời gian
        userPosts.sort((p1, p2) -> {
            LocalDateTime dateTime1 = p1.getSharedAt() != null ? p1.getSharedAt() : p1.getCreatedAt();
            LocalDateTime dateTime2 = p2.getSharedAt() != null ? p2.getSharedAt() : p2.getCreatedAt();
            return dateTime2.compareTo(dateTime1); // Sắp xếp giảm dần theo thời gian
        });

        return userPosts;
    }

    // Lấy danh sách bạn bè của người dùng
    public List<UserDTO> getUserFriends(Long userId) {
        // Sử dụng FriendshipService để lấy danh sách bạn bè
        return friendshipService.getAcceptedFriends(userId);
    }
}
