package com.example.WebSocialMedia_Server.Service;

import com.example.WebSocialMedia_Server.DTO.CommentDTO;
import com.example.WebSocialMedia_Server.Entity.Comment;
import com.example.WebSocialMedia_Server.Entity.Post;
import com.example.WebSocialMedia_Server.Entity.User;
import com.example.WebSocialMedia_Server.Repository.CommentRepository;
import com.example.WebSocialMedia_Server.Repository.PostRepository;
import com.example.WebSocialMedia_Server.Repository.UserRepository;
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
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // Tạo bình luận mới cho bài viết
    @Transactional
    public CommentDTO createComment(Long postId, String content, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

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
    public List<CommentDTO> getCommentsByPostId(Long postId) {
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
}
