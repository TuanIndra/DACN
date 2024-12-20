package com.example.WebSocialMedia_Server.Repository;

import com.example.WebSocialMedia_Server.Entity.Message;
import com.example.WebSocialMedia_Server.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1) " +
            "ORDER BY m.createdAt ASC")
    List<Message> findConversation(User user1, User user2);

    // Lấy tin nhắn mới (chưa đọc), giả sử "mới" nghĩa là isRead = false và do user kia gửi
    @Query("SELECT m FROM Message m WHERE " +
            "((m.sender = :otherUser AND m.receiver = :currentUser) OR (m.receiver = :otherUser AND m.sender = :currentUser)) " +
            "AND m.isRead = false " +
            "ORDER BY m.createdAt ASC")
    List<Message> findUnreadMessages(User currentUser, User otherUser);
    @Query("SELECT m.sender.id AS friendId, COUNT(m) AS unreadMessages " +
            "FROM Message m " +
            "WHERE m.receiver.id = :userId AND m.isRead = false " +
            "GROUP BY m.sender.id")
    List<UnreadMessagesCount> countUnreadMessagesByUser(@Param("userId") Long userId);

    interface UnreadMessagesCount {
        Long getFriendId();
        Long getUnreadMessages();
    }
}


