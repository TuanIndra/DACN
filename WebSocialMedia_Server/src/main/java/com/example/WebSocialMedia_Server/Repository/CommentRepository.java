package com.example.WebSocialMedia_Server.Repository;

import com.example.WebSocialMedia_Server.Entity.Comment;
import com.example.WebSocialMedia_Server.Entity.Share;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostIdAndParentCommentIsNull(Long postId);
    int countByPostId(Long postId);
}
