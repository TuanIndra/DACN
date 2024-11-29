package com.example.WebSocialMedia_Server.Repository;

import com.example.WebSocialMedia_Server.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    Optional<Reaction> findByUserAndPost(User user, Post post);
    Optional<Reaction> findByUserAndComment(User user, Comment comment);
    long countByPostAndReactionType(Post post, ReactionType reactionType);
    long countByCommentAndReactionType(Comment comment, ReactionType reactionType);
    // Đếm số reactions cho một bài viết
    @Query("SELECT COUNT(r) FROM Reaction r WHERE r.post.id = :postId")
    int countByPostId(@Param("postId") Long postId);

    // Đếm số reactions cho một bình luận
    @Query("SELECT COUNT(r) FROM Reaction r WHERE r.comment.id = :commentId")
    int countByCommentId(@Param("commentId") Long commentId);
}
