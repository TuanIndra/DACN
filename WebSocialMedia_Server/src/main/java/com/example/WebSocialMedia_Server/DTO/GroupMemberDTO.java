package com.example.WebSocialMedia_Server.DTO;

import lombok.Data;

@Data
public class GroupMemberDTO {
    private Long id; // ID của GroupMember
    private Long groupId; // ID của nhóm
    private String groupName; // Tên nhóm (nếu cần)
    private Long userId; // ID của người dùng
    private String username; // Tên người dùng
    private String fullName; // Tên đầy đủ của người dùng
    private String avatarUrl; // Avatar của người dùng
    private String role; // Vai trò của thành viên (ADMIN, MEMBER)
    private String status; // Trạng thái yêu cầu (PENDING, ACCEPTED, REJECTED)
}
