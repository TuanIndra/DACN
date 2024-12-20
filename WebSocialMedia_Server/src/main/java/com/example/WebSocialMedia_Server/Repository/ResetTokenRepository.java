package com.example.WebSocialMedia_Server.Repository;

import com.example.WebSocialMedia_Server.Entity.ResetToken;
import com.example.WebSocialMedia_Server.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResetTokenRepository extends JpaRepository<ResetToken, Long> {
    Optional<ResetToken> findByToken(String token);
    void deleteByUser(User user);
}

