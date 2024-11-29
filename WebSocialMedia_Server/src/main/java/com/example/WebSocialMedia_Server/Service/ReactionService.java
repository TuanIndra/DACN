package com.example.WebSocialMedia_Server.Service;

import com.example.WebSocialMedia_Server.Entity.*;
import com.example.WebSocialMedia_Server.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class ReactionService {

    @Autowired
    private ReactionRepository reactionRepository;

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    // Thêm reaction cho bài viết
    @Transactional
    public void reactToPost(Long postId, String username, ReactionType reactionType) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Kiểm tra quyền truy cập bài viết
        if (post.getGroup() != null) {
            Group group = post.getGroup();

            // Nếu nhóm là PRIVATE hoặc SECRET, chỉ cho phép thành viên được chấp nhận tương tác
            if (group.getPrivacy() == GroupPrivacy.PRIVATE || group.getPrivacy() == GroupPrivacy.SECRET) {
                boolean isAcceptedMember = groupMemberRepository.existsByGroupAndUserAndStatus(group, user, RequestStatus.ACCEPTED);
                if (!isAcceptedMember) {
                    throw new RuntimeException("You are not authorized to react to this post");
                }
            }
        }

        // Kiểm tra xem người dùng đã reaction chưa
        Optional<Reaction> existingReactionOpt = reactionRepository.findByUserAndPost(user, post);

        if (existingReactionOpt.isPresent()) {
            // Nếu đã reaction, cập nhật reactionType
            Reaction existingReaction = existingReactionOpt.get();
            existingReaction.setReactionType(reactionType);
            reactionRepository.save(existingReaction);
        } else {
            // Nếu chưa, tạo mới reaction
            Reaction reaction = new Reaction();
            reaction.setUser(user);
            reaction.setPost(post);
            reaction.setReactionType(reactionType);
            reactionRepository.save(reaction);
        }
    }

    // Thêm reaction cho bình luận
    @Transactional
    public void reactToComment(Long commentId, String username, ReactionType reactionType) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        Post post = comment.getPost();

        // Kiểm tra quyền truy cập bài viết
        if (post.getGroup() != null) {
            Group group = post.getGroup();

            // Nếu nhóm là PRIVATE hoặc SECRET, chỉ cho phép thành viên được chấp nhận tương tác
            if (group.getPrivacy() == GroupPrivacy.PRIVATE || group.getPrivacy() == GroupPrivacy.SECRET) {
                boolean isAcceptedMember = groupMemberRepository.existsByGroupAndUserAndStatus(group, user, RequestStatus.ACCEPTED);
                if (!isAcceptedMember) {
                    throw new RuntimeException("You are not authorized to react to this comment");
                }
            }
        }


        // Kiểm tra xem người dùng đã reaction chưa
        Optional<Reaction> existingReactionOpt = reactionRepository.findByUserAndComment(user, comment);

        if (existingReactionOpt.isPresent()) {
            // Nếu đã reaction, cập nhật reactionType
            Reaction existingReaction = existingReactionOpt.get();
            existingReaction.setReactionType(reactionType);
            reactionRepository.save(existingReaction);
        } else {
            // Nếu chưa, tạo mới reaction
            Reaction reaction = new Reaction();
            reaction.setUser(user);
            reaction.setComment(comment);
            reaction.setReactionType(reactionType);
            reactionRepository.save(reaction);
        }
    }

    // Xóa reaction cho bài viết
    @Transactional
    public void removeReactionFromPost(Long postId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Optional<Reaction> existingReactionOpt = reactionRepository.findByUserAndPost(user, post);

        existingReactionOpt.ifPresent(reactionRepository::delete);
    }

    // Xóa reaction cho bình luận
    @Transactional
    public void removeReactionFromComment(Long commentId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        Optional<Reaction> existingReactionOpt = reactionRepository.findByUserAndComment(user, comment);

        existingReactionOpt.ifPresent(reactionRepository::delete);
    }

    // Đếm reaction cho bài viết
    public Map<ReactionType, Long> countReactionsForPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Map<ReactionType, Long> counts = new HashMap<>();

        for (ReactionType type : ReactionType.values()) {
            long count = reactionRepository.countByPostAndReactionType(post, type);
            counts.put(type, count);
        }

        return counts;
    }

    // Đếm reaction cho bình luận
    public Map<ReactionType, Long> countReactionsForComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        Map<ReactionType, Long> counts = new HashMap<>();

        for (ReactionType type : ReactionType.values()) {
            long count = reactionRepository.countByCommentAndReactionType(comment, type);
            counts.put(type, count);
        }

        return counts;
    }
}

