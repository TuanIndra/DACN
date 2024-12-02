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
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private ReactionRepository reactionRepository;

    @Autowired
    private CommentRepository commentRepository;

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
    private GroupRepository groupRepository;

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Transactional
    //tạo bài dang
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

        // Nếu có groupId, kiểm tra quyền và gán nhóm
        Group group = null;
        if (postDTO.getGroupId() != null) {
            group = groupRepository.findById(postDTO.getGroupId())
                    .orElseThrow(() -> new RuntimeException("Group not found"));

            // Kiểm tra xem người dùng có phải là thành viên đã được duyệt không
            boolean isAcceptedMember = groupMemberRepository.existsByGroupAndUserAndStatus(group, user, RequestStatus.ACCEPTED);
            if (!isAcceptedMember) {
                throw new RuntimeException("You are not allowed to post in this group");
            }
            post.setGroup(group);
        }
        // Khởi tạo mediaList
        post.setMediaList(new ArrayList<>());

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

    // Phương thức lấy tat ca bai viet cong khai
    public List<PostDTO> getAllPosts() {
        List<Post> posts = postRepository.findAll().stream()
                .filter(post -> post.getGroup() == null || post.getGroup().getPrivacy() == GroupPrivacy.PUBLIC)
                .collect(Collectors.toList());


        return posts.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    //Lay bai viet cho nhung nguoi thuoc nhom PRVIVATE va SECRET
    public List<PostDTO> getPostsByPrivateOrSecretGroups(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));


        List<Group> privateAndSecretGroups = groupMemberRepository.findByUserAndStatus(user, RequestStatus.ACCEPTED)
                .stream()
                .map(GroupMember::getGroup)
                .filter(group -> group.getPrivacy() == GroupPrivacy.PRIVATE || group.getPrivacy() == GroupPrivacy.SECRET)
                .collect(Collectors.toList());

        List<Post> posts = postRepository.findByGroupIn(privateAndSecretGroups);

        return posts.stream().map(this::convertToDTO).collect(Collectors.toList());
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

    @Transactional
    public void deletePost(Long postId, String username) {
        // Tìm bài viết theo ID
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Kiểm tra xem người dùng hiện tại có phải là chủ bài viết không
        if (!post.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to delete this post");
        }

        // Xóa bài viết
        postRepository.delete(post);
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
        userDTO.setAvatarUrl(user.getAvatarUrl());

        // Thêm thông tin nhóm nếu có
        if (post.getGroup() != null) {
            postDTO.setGroupId(post.getGroup().getId());
            postDTO.setNameGroup(post.getGroup().getName());
        }

        // Xử lý thông tin người share
        Share share = post.getShares() != null
                ? post.getShares().stream().findFirst().orElse(null)
                : null;

        if (share != null) {
            User sharedByUser = share.getUser();
            if (sharedByUser != null) {
                UserDTO sharedByDTO = new UserDTO();
                sharedByDTO.setId(sharedByUser.getId());
                sharedByDTO.setUsername(sharedByUser.getUsername());
                sharedByDTO.setFullName(sharedByUser.getFullName());
                postDTO.setSharedBy(sharedByDTO);
            }
            postDTO.setShareComment(share.getComment());
            postDTO.setSharedAt(share.getSharedAt());
        }

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
        int commentCount = commentRepository.countByPostId(post.getId());
        postDTO.setCommentCount(commentCount);
        // Đếm số reactions cho post
        int reactionCount = reactionRepository.countByPostId(post.getId());
        postDTO.setReactionCount(reactionCount);

        return postDTO;
    }

    //Phương thức chỉnh sửa bài viết
    @Transactional
    public Post updatePost(Long postId, String updatedContent, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Kiểm tra quyền chỉnh sửa
        if (!post.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to edit this post");
        }

        // Cập nhật nội dung bài viết
        post.setContent(updatedContent);
        post.setUpdatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

    //Phương thức xem các bài đăng trong group
    public List<PostDTO> getPostsByGroup(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        List<Post> posts = postRepository.findByGroup(group);

        // Chuyển đổi sang PostDTO
        return posts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}

