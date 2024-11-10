package com.example.WebSocialMedia_Server.Repository;

import com.example.WebSocialMedia_Server.Entity.Reaction;
import com.example.WebSocialMedia_Server.Entity.ReactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    List<Reaction> findByPostId(Long postId);
    List<Reaction> findByCommentId(Long commentId);
    List<Reaction> findByUserId(Long userId);
    Optional<Reaction> findByUserIdAndPostId(Long userId, Long postId);
    Optional<Reaction> findByUserIdAndCommentId(Long userId, Long commentId);
    Long countByPostIdAndReactionType(Long postId, ReactionType reactionType);
    Long countByCommentIdAndReactionType(Long commentId, ReactionType reactionType);
}
