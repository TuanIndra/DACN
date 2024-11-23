package com.example.WebSocialMedia_Server.Repository;

import com.example.WebSocialMedia_Server.Entity.Post;
import com.example.WebSocialMedia_Server.Entity.Share;
import com.example.WebSocialMedia_Server.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShareRepository extends JpaRepository<Share, Long> {
    // Tìm danh sách chia sẻ theo người dùng
    List<Share> findByUser(User user);

}
