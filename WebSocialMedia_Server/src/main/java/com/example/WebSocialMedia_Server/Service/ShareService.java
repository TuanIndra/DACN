package com.example.WebSocialMedia_Server.Service;

import com.example.WebSocialMedia_Server.DTO.ShareDTO;
import com.example.WebSocialMedia_Server.DTO.UserDTO;
import com.example.WebSocialMedia_Server.Entity.*;
import com.example.WebSocialMedia_Server.Repository.ShareRepository;
import com.example.WebSocialMedia_Server.Repository.PostRepository;
import com.example.WebSocialMedia_Server.Repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ShareService {

    @Autowired
    private ShareRepository shareRepository;

    @Autowired
    private NotificationService notificationService;

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
    public Share sharePost(Long postId, String username, String comment) {
        // Tìm bài viết gốc
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Tìm người dùng chia sẻ
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Nếu bài viết thuộc nhóm PRIVATE hoặc SECRET, không cho phép share
        if (post.getGroup() != null) {
            Group group = post.getGroup();
            if (group.getPrivacy() == GroupPrivacy.PRIVATE || group.getPrivacy() == GroupPrivacy.SECRET) {
                throw new RuntimeException("You cannot share posts from PRIVATE or SECRET groups.");
            }
        }

        // Tạo thông báo cho chủ bài viết gốc
        if (!user.getId().equals(post.getUser().getId())) {
            notificationService.createNotification(
                    post.getUser().getId(),
                    NotificationType.SHARE,
                    postId
            );
        }

        // Tạo đối tượng Share
        Share share = Share.builder()
                .post(post)
                .user(user)
                .comment(comment)
                .sharedAt(LocalDateTime.now())
                .build();

        // Lưu đối tượng Share
        return shareRepository.save(share);
    }

    @Transactional(readOnly = true)
    public ShareDTO convertToDTO(Share share) {
        ShareDTO shareDTO = new ShareDTO();

        // Thông tin bài viết được chia sẻ
        shareDTO.setPost(postService.convertToDTO(share.getPost()));

        // Thông tin người chia sẻ
        UserDTO userDTO = new UserDTO();
        userDTO.setId(share.getUser().getId());
        userDTO.setUsername(share.getUser().getUsername());
        userDTO.setFullName(share.getUser().getFullName());
        shareDTO.setUser(userDTO);

        shareDTO.setComment(share.getComment());
        shareDTO.setSharedAt(share.getSharedAt());

        return shareDTO;
    }

}
