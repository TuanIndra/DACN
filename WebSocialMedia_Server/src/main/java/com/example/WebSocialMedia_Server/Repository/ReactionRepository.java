package com.example.WebSocialMedia_Server.Repository;

import com.example.WebSocialMedia_Server.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    Optional<Reaction> findByUserAndPost(User user, Post post);
    Optional<Reaction> findByUserAndComment(User user, Comment comment);
    long countByPostAndReactionType(Post post, ReactionType reactionType);
    long countByCommentAndReactionType(Comment comment, ReactionType reactionType);
}
