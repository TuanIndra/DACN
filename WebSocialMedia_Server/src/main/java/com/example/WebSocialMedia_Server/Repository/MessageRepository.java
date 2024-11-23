package com.example.WebSocialMedia_Server.Repository;

import com.example.WebSocialMedia_Server.Entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

}
