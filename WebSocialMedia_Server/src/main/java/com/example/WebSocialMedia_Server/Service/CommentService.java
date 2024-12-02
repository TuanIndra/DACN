package com.example.WebSocialMedia_Server.Service;

import com.example.WebSocialMedia_Server.DTO.CommentDTO;
import com.example.WebSocialMedia_Server.Entity.*;
import com.example.WebSocialMedia_Server.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ReactionRepository reactionRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Autowired
    private ShareRepository shareRepository;

    @Autowired
    private NotificationService notificationService;

    // Tạo bình luận mới cho bài viết
    @Transactional
    public CommentDTO createComment(Long postId, String content, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Kiểm tra quyền truy cập bài viết
        if (post.getGroup() != null) {
            Group group = post.getGroup();

            // Nếu nhóm là PRIVATE hoặc SECRET, chỉ cho phép thành viên được chấp nhận bình luận
            if (group.getPrivacy() == GroupPrivacy.PRIVATE || group.getPrivacy() == GroupPrivacy.SECRET) {
                boolean isAcceptedMember = groupMemberRepository.existsByGroupAndUserAndStatus(group, user, RequestStatus.ACCEPTED);
                if (!isAcceptedMember) {
                    throw new RuntimeException("You are not authorized to comment on this post");
                }
            }
        }

        // Tạo thông báo cho chủ bài viết
        if (!user.getId().equals(post.getUser().getId())) {
            notificationService.createNotification(
                    post.getUser().getId(),
                    NotificationType.COMMENT,
                    user.getId()
            );
        }
        Comment comment = new Comment();
        comment.setContent(content);
        comment.setUser(user);
        comment.setPost(post);

        Comment savedComment = commentRepository.save(comment);

        return convertToDTO(savedComment);
    }

    // Trả lời một bình luận
    @Transactional
    public CommentDTO replyToComment(Long parentCommentId, String content, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new RuntimeException("Parent comment not found"));

        Post post = parentComment.getPost();
        // Kiểm tra quyền truy cập bài viết
        if (post.getGroup() != null) {
            Group group = post.getGroup();

            // Nếu nhóm là PRIVATE hoặc SECRET, chỉ cho phép thành viên được chấp nhận trả lời
            if (group.getPrivacy() == GroupPrivacy.PRIVATE || group.getPrivacy() == GroupPrivacy.SECRET) {
                boolean isAcceptedMember = groupMemberRepository.existsByGroupAndUserAndStatus(group, user, RequestStatus.ACCEPTED);
                if (!isAcceptedMember) {
                    throw new RuntimeException("You are not authorized to reply to this comment");
                }
            }
        }

        Comment reply = new Comment();
        reply.setContent(content);
        reply.setUser(user);
        reply.setPost(parentComment.getPost());
        reply.setParentComment(parentComment);

        Comment savedReply = commentRepository.save(reply);

        return convertToDTO(savedReply);
    }

    // Lấy danh sách bình luận của một bài viết
    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByPostId(Long postId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        // Kiểm tra quyền truy cập bài viết
        if (post.getGroup() != null) {
            Group group = post.getGroup();

            // Nếu nhóm là PRIVATE hoặc SECRET, chỉ cho phép thành viên được chấp nhận xem bình luận
            if (group.getPrivacy() == GroupPrivacy.PRIVATE || group.getPrivacy() == GroupPrivacy.SECRET) {
                boolean isAcceptedMember = groupMemberRepository.existsByGroupAndUserAndStatus(group, user, RequestStatus.ACCEPTED);
                if (!isAcceptedMember) {
                    throw new RuntimeException("You are not authorized to view comments for this post");
                }
            }
        }
        List<Comment> comments = commentRepository.findByPostIdAndParentCommentIsNull(postId);
        return comments.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Chuyển đổi Comment sang CommentDTO
    public CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setPostId(comment.getPost().getId());
        dto.setUserId(comment.getUser().getId());
        dto.setUsername(comment.getUser().getUsername());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());

        // Chuyển đổi danh sách phản hồi
        if (comment.getReplies() != null && !comment.getReplies().isEmpty()) {
            List<CommentDTO> replies = comment.getReplies().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            dto.setReplies(replies);
        }

        // Đếm số reactions cho comment
        int reactionCount = reactionRepository.countByCommentId(comment.getId());
        dto.setReactionCount(reactionCount);
        return dto;
    }
    //chuc năng dem bl
    public int countCommentsByPostId(Long postId) {
        return commentRepository.countByPostId(postId);
    }
    // Sửa bình luan
    @Transactional
    public Comment updateComment(Long commentId, String updatedContent, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Kiểm tra quyền chỉnh sửa
        if (!comment.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to edit this comment");
        }

        // Cập nhật nội dung bình luận
        comment.setContent(updatedContent);
        comment.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    @Transactional
    public CommentDTO createCommentForShare(Long shareId, String content, String username) {
        // Lấy thông tin người dùng
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Lấy bài chia sẻ
        Share share = shareRepository.findById(shareId)
                .orElseThrow(() -> new RuntimeException("Shared post not found"));

        // Tạo mới bình luận
        Comment comment = new Comment();
        comment.setContent(content);
        comment.setUser(user);
        comment.setPost(share.getPost()); // Liên kết bình luận với bài gốc
        comment.setParentComment(null);

        Comment savedComment = commentRepository.save(comment);

        return convertToDTO(savedComment);
    }

    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsForSharedPost(Long shareId) {
        Share share = shareRepository.findById(shareId)
                .orElseThrow(() -> new RuntimeException("Shared post not found"));

        List<Comment> comments = commentRepository.findByPostIdAndParentCommentIsNull(share.getPost().getId());
        return comments.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

}
