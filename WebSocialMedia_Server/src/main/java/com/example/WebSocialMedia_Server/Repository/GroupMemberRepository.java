package com.example.WebSocialMedia_Server.Repository;

import com.example.WebSocialMedia_Server.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    boolean existsByGroupAndUser(Group group, User user);

    Optional<GroupMember> findByGroupAndUser(Group group, User user);
    List<GroupMember> findByGroupAndStatus(Group group, RequestStatus status);

    List<GroupMember> findByGroupId(Long groupId);
    // Tìm thành viên của nhóm theo groupId, userId và role
    Optional<GroupMember> findByGroupIdAndUserIdAndRole(Long groupId, Long userId, GroupRole role);

    List<GroupMember> findByGroupIdAndStatus(Long groupId, RequestStatus status);
    // Tìm thành viên của nhóm theo groupId, userId và status
    Optional<GroupMember> findByGroupIdAndUserIdAndStatus(Long groupId, Long userId, RequestStatus status);

    List<GroupMember> findByUserAndStatus(User user, RequestStatus status);
    boolean existsByGroupAndUserAndStatus(Group group, User user, RequestStatus status);
}
