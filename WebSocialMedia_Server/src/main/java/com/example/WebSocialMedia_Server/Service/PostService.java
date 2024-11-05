package com.example.WebSocialMedia_Server.Service;

import com.example.WebSocialMedia_Server.DTO.PostDTO;
import com.example.WebSocialMedia_Server.DTO.MediaDTO;
import com.example.WebSocialMedia_Server.DTO.UserDTO;
import com.example.WebSocialMedia_Server.Entity.*;
import com.example.WebSocialMedia_Server.Repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.nio.file.*;
import java.util.*;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    private ShareRepository shareRepository;

    @Autowired
    private FriendshipService friendshipService;

    @Autowired
    private UserService userService;

    @Autowired
    private GroupRepository groupRepository; // Nếu bạn sử dụng chức năng nhóm

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Transactional
    public Post createPost(PostDTO postDTO, List<MultipartFile> files, String username) {
        // Lấy thông tin người dùng từ username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tạo đối tượng Post
        Post post = Post.builder()
                .content(postDTO.getContent())
                .user(user)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        // Khởi tạo mediaList
        post.setMediaList(new ArrayList<>());

        // Nếu bài viết thuộc một nhóm
        if (postDTO.getGroupId() != null) {
            Group group = groupRepository.findById(postDTO.getGroupId())
                    .orElseThrow(() -> new RuntimeException("Group not found"));
            post.setGroup(group);
        }

        // Lưu bài viết vào cơ sở dữ liệu
        post = postRepository.save(post);

        // Xử lý tệp tin
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                // Kiểm tra kích thước tệp tin (nếu cần)
                if (file.getSize() > 10 * 1024 * 1024) { // 10MB
                    throw new RuntimeException("File size exceeds the maximum limit (10MB)");
                }

                // Lưu tệp tin vào máy chủ
                String fileName = storeFile(file);

                // Xác định loại media
                String contentType = file.getContentType();
                MediaType mediaType = determineMediaType(contentType);

                // Tạo đối tượng Media
                Media media = Media.builder()
                        .url(fileName)
                        .type(mediaType)
                        .post(post)
                        .build();

                // Lưu Media vào cơ sở dữ liệu
                mediaRepository.save(media);

                // Thêm media vào danh sách của post
                post.getMediaList().add(media);
            }
        }

        return post;
    }

    // Phương thức lấy dòng thời gian của người dùng
    public List<PostDTO> getUserTimeline(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Lấy danh sách bài viết do người dùng tạo
        List<Post> userPosts = postRepository.findByUser(user);

        // Lấy danh sách các chia sẻ của người dùng
        List<Share> userShares = shareRepository.findByUser(user);

        // Tạo danh sách PostDTO
        List<PostDTO> timelinePosts = new ArrayList<>();

        // Chuyển đổi các bài viết do người dùng tạo thành PostDTO
        for (Post post : userPosts) {
            PostDTO postDTO = convertToDTO(post);
            timelinePosts.add(postDTO);
        }

        // Chuyển đổi các bài viết được chia sẻ thành PostDTO
        for (Share share : userShares) {
            Post sharedPost = share.getPost();
            PostDTO postDTO = convertToDTO(sharedPost);

            // Thêm thông tin về việc chia sẻ
            postDTO.setSharedBy(userService.convertToDTO(user));
            postDTO.setSharedAt(share.getSharedAt());
            //postDTO.setShareComment(share.getComment()); // Nếu bạn có trường comment trong Share

            timelinePosts.add(postDTO);
        }

        // Sắp xếp danh sách theo thời gian (giảm dần)
        timelinePosts.sort((p1, p2) -> {
            LocalDateTime dateTime1 = p1.getSharedAt() != null ? p1.getSharedAt() : p1.getCreatedAt();
            LocalDateTime dateTime2 = p2.getSharedAt() != null ? p2.getSharedAt() : p2.getCreatedAt();
            return dateTime2.compareTo(dateTime1); // Sắp xếp giảm dần theo thời gian
        });

        return timelinePosts;
    }
    public List<PostDTO> getNewsFeed(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<User> friends = friendshipService.getFriends(userId);
        friends.add(user);  // Bao gồm cả chính người dùng

        List<PostDTO> newsFeedPosts = new ArrayList<>();

        for (User friend : friends) {
            List<Post> friendPosts = postRepository.findByUser(friend);
            for (Post post : friendPosts) {
                PostDTO postDTO = convertToDTO(post);
                newsFeedPosts.add(postDTO);
            }

            List<Share> friendShares = shareRepository.findByUser(friend);
            for (Share share : friendShares) {
                Post sharedPost = share.getPost();
                PostDTO postDTO = convertToDTO(sharedPost);

                postDTO.setSharedBy(userService.convertToDTO(friend));
                postDTO.setSharedAt(share.getSharedAt());
                postDTO.setShareComment(share.getComment());

                newsFeedPosts.add(postDTO);
            }
        }

        newsFeedPosts.sort((p1, p2) -> {
            LocalDateTime dateTime1 = p1.getSharedAt() != null ? p1.getSharedAt() : p1.getCreatedAt();
            LocalDateTime dateTime2 = p2.getSharedAt() != null ? p2.getSharedAt() : p2.getCreatedAt();
            return dateTime2.compareTo(dateTime1);
        });

        return newsFeedPosts;
    }

    // Hàm lưu tệp tin vào máy chủ
    private String storeFile(MultipartFile file) {
        try {
            // Tạo tên tệp tin duy nhất
            String fileName = StringUtils.cleanPath(UUID.randomUUID() + "_" + file.getOriginalFilename());

            // Đường dẫn đầy đủ
            Path targetLocation = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(fileName);

            // Tạo thư mục nếu chưa tồn tại
            Files.createDirectories(targetLocation.getParent());

            // Sao chép tệp tin
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + file.getOriginalFilename(), ex);
        }
    }

    // Hàm xác định loại media
    private MediaType determineMediaType(String contentType) {
        String type = contentType.split("/")[0].toUpperCase(); // "IMAGE", "VIDEO", etc.

        try {
            return MediaType.valueOf(type);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid media type: " + type);
        }
    }

    // Phương thức chuyển đổi Post sang PostDTO
    public PostDTO convertToDTO(Post post) {
        PostDTO postDTO = new PostDTO();
        postDTO.setId(post.getId());
        postDTO.setContent(post.getContent());
        postDTO.setCreatedAt(post.getCreatedAt());
        postDTO.setUpdatedAt(post.getUpdatedAt());

        User user = post.getUser();
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setFullName(user.getFullName());

        postDTO.setUser(userDTO);

        // Xử lý mediaList
        if (post.getMediaList() != null) {
            List<MediaDTO> mediaDTOList = new ArrayList<>();
            for (Media media : post.getMediaList()) {
                MediaDTO mediaDTO = new MediaDTO();
                mediaDTO.setId(media.getId());
                mediaDTO.setUrl(media.getUrl());
                mediaDTO.setMediaType(media.getType().name()); // Sử dụng .name() để lấy giá trị Enum
                mediaDTOList.add(mediaDTO);
            }
            postDTO.setMediaList(mediaDTOList);
        }

        return postDTO;
    }
}

