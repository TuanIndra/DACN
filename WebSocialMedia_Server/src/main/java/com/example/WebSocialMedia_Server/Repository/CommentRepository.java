package com.example.WebSocialMedia_Server.Repository;

import com.example.WebSocialMedia_Server.Entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId);
    List<Comment> findByParentCommentId(Long parentCommentId);
    List<Comment> findByPostIdAndParentCommentIsNull(Long postId);
}
