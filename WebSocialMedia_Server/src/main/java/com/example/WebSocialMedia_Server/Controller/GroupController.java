package com.example.WebSocialMedia_Server.Controller;

import com.example.WebSocialMedia_Server.DTO.GroupDTO;
import com.example.WebSocialMedia_Server.DTO.GroupMemberDTO;
import com.example.WebSocialMedia_Server.DTO.PostDTO;
import com.example.WebSocialMedia_Server.Entity.Group;
import com.example.WebSocialMedia_Server.Entity.GroupMember;
import com.example.WebSocialMedia_Server.Service.GroupService;
import com.example.WebSocialMedia_Server.Service.PostService;
import com.example.WebSocialMedia_Server.Service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    //tạo nhóm
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GroupDTO> createGroup(
            @RequestPart("group") String groupJson,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
            Authentication authentication) throws JsonProcessingException {

        // Lấy username từ token JWT
        String username = authentication.getName();

        // Chuyển đổi groupJson thành GroupDTO
        ObjectMapper objectMapper = new ObjectMapper();
        GroupDTO groupDTO = objectMapper.readValue(groupJson, GroupDTO.class);

        // Tạo nhóm mới thông qua service
        Group createdGroup = groupService.createGroup(username, groupDTO, imageFile);

        // Chuyển đổi Group sang GroupDTO
        GroupDTO responseDTO = groupService.convertToDTO(createdGroup);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    //Người dùng xin vào nhóm
    @PostMapping("/{groupId}/request")
    public ResponseEntity<String> joinGroup(
            @PathVariable Long groupId,
            Authentication authentication) {

        String username = authentication.getName();
        groupService.joinGroup(groupId, username);

        return ResponseEntity.ok("Join request sent successfully.");
    }

    //Thêm endpoint cho admin duyệt hoặc từ chối yêu cầu
    @PutMapping("/{groupId}/members/{memberId}/handle")
    public ResponseEntity<String> handleMembershipRequest(
            @PathVariable Long groupId,
            @PathVariable Long memberId,
            @RequestParam("action") String action,
            Authentication authentication) {

        // Lấy thông tin admin từ JWT
        String adminUsername = authentication.getName();
        Long adminId = userService.findByUsername(adminUsername).getId();

        boolean isAccepted = action.equalsIgnoreCase("accept");

        String result = groupService.handleMembershipRequest(groupId, memberId, isAccepted, adminId);
        return ResponseEntity.ok(result);
    }

    //danh sach cho duyet nhom
    @GetMapping("/{groupId}/requests")
    public ResponseEntity<List<GroupMemberDTO>> getPendingRequests(
            @PathVariable Long groupId,
            Authentication authentication) {

        String adminUsername = authentication.getName();
        List<GroupMember> pendingRequests = groupService.getPendingRequests(groupId, adminUsername);

        // Chuyển đổi sang DTO
        List<GroupMemberDTO> requests = pendingRequests.stream()
                .map(groupService::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(requests);
    }

    // Lấy danh sách thành viên của nhóm
    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<GroupMemberDTO>> getGroupMembers(@PathVariable Long groupId) {
        List<GroupMemberDTO> members = groupService.getGroupMembers(groupId);
        return ResponseEntity.ok(members);
    }

    //danh sach user bi tu choi vao nhom
    @GetMapping("/{groupId}/rejected")
    public ResponseEntity<List<GroupMemberDTO>> getRejectedRequests(
            @PathVariable Long groupId,
            Authentication authentication) {

        String adminUsername = authentication.getName();
        List<GroupMember> rejectedRequests = groupService.getRejectedRequests(groupId, adminUsername);

        // Chuyển đổi sang DTO
        List<GroupMemberDTO> requests = rejectedRequests.stream()
                .map(groupService::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(requests);
    }

    //thêm nguoi khac vào nhóm
    @PostMapping("/{groupId}/addMember")
    public ResponseEntity<String> addMember(
            @PathVariable Long groupId,
            @RequestParam String memberUsername,
            Authentication authentication) {

        String adminUsername = authentication.getName();
        groupService.addMember(groupId, adminUsername, memberUsername);

        return ResponseEntity.ok("Member added successfully");
    }

    //Chinh sua status rejected thanh pending
    @PutMapping("/{groupId}/members/{memberId}/change-status")
    public ResponseEntity<String> changeMemberStatus(
            @PathVariable Long groupId,
            @PathVariable Long memberId,
            @RequestParam("action") String action,
            Authentication authentication) {

        String adminUsername = authentication.getName();
        Long adminId = userService.findByUsername(adminUsername).getId();

        String result = groupService.changeMemberStatus(groupId, memberId, action, adminId);
        return ResponseEntity.ok(result);
    }

    //xóa người dùng khỏi nhóm
    @DeleteMapping("/{groupId}/members")
    public ResponseEntity<String> removeMember(
            @PathVariable Long groupId,
            @RequestParam String memberUsername,
            Authentication authentication) {

        String adminUsername = authentication.getName();
        groupService.removeMember(groupId, adminUsername, memberUsername);

        return ResponseEntity.ok("Member removed successfully");
    }

    //rời nhóm
    @PostMapping("/{groupId}/leave")
    public ResponseEntity<String> leaveGroup(
            @PathVariable Long groupId,
            Authentication authentication) {

        String username = authentication.getName();
        groupService.leaveGroup(groupId, username);

        return ResponseEntity.ok("Left group successfully");
    }

    //xem bài viết của nhóm
    @GetMapping("/{groupId}/posts")
    public ResponseEntity<List<PostDTO>> getGroupPosts(
            @PathVariable Long groupId,
            Authentication authentication) {

        String username = authentication.getName();

        // Kiểm tra xem người dùng có phải là thành viên không
        boolean isMember = groupService.isMember(groupId, username);
        if (!isMember) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<PostDTO> posts = postService.getPostsByGroup(groupId);

        return ResponseEntity.ok(posts);
    }

    //Sửa thông tin nhóm
    @PutMapping("/{groupId}")
    public ResponseEntity<GroupDTO> updateGroup(
            @PathVariable Long groupId,
            @RequestBody GroupDTO groupDTO,
            Authentication authentication) {

        String username = authentication.getName();
        Group updatedGroup = groupService.updateGroup(groupId, username, groupDTO);

        // Chuyển đổi sang DTO
        GroupDTO responseDTO = groupService.convertToDTO(updatedGroup);

        return ResponseEntity.ok(responseDTO);
    }

    //Xóa nhóm
    @DeleteMapping("/{groupId}")
    public ResponseEntity<String> deleteGroup(
            @PathVariable Long groupId,
            Authentication authentication) {

        String username = authentication.getName();
        groupService.deleteGroup(groupId, username);

        return ResponseEntity.ok("Group deleted successfully");
    }

    // Endpoint lấy danh sách nhóm PUBLIC
    @GetMapping("/public")
    public ResponseEntity<List<GroupDTO>> getPublicGroups() {
        List<GroupDTO> publicGroups = groupService.getPublicGroups();
        return ResponseEntity.ok(publicGroups);
    }

    // doi anh dai dien nhom
    @PutMapping("/{groupId}/update-image")
    public ResponseEntity<GroupDTO> updateGroupImage(
            @PathVariable Long groupId,
            @RequestParam("imageFile") MultipartFile imageFile,
            Authentication authentication) {

        // Lấy tên admin từ JWT
        String adminUsername = authentication.getName();

        // Gọi service để đổi ảnh nhóm
        GroupDTO updatedGroup = groupService.updateGroupImage(groupId, adminUsername, imageFile);

        return ResponseEntity.ok(updatedGroup);
    }

    @GetMapping
    public ResponseEntity<List<GroupDTO>> getAllGroups() {
        List<Group> groups = groupService.getAllGroups();

        // Chuyển đổi sang DTO
        List<GroupDTO> groupDTOs = groups.stream()
                .map(groupService::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(groupDTOs);
    }

    // Lấy thông tin chi tiết của nhóm
    @GetMapping("/{groupId}")
    public ResponseEntity<GroupDTO> getGroupDetails(@PathVariable Long groupId) {
        Group group = groupService.getGroupById(groupId);

        // Chuyển đổi sang DTO
        GroupDTO groupDTO = groupService.convertToDTO(group);
        return ResponseEntity.ok(groupDTO);
    }

    // Kiểm tra xem người dùng có phải là thành viên của nhóm không
    @GetMapping("/{groupId}/is-member")
    public ResponseEntity<Boolean> checkMembership(
            @PathVariable Long groupId,
            Authentication authentication) {
        String username = authentication.getName();
        boolean isMember = groupService.isMember(groupId, username);
        return ResponseEntity.ok(isMember);
    }

    @GetMapping("/{groupId}/is-admin")
    public ResponseEntity<Boolean> isAdmin(
            @PathVariable Long groupId,
            Authentication authentication) {

        String username = authentication.getName();
        boolean isAdmin = groupService.isAdmin(groupId, username);
        return ResponseEntity.ok(isAdmin);
    }
}

