package com.example.WebSocialMedia_Server.Service;

import com.example.WebSocialMedia_Server.DTO.GroupDTO;
import com.example.WebSocialMedia_Server.DTO.GroupMemberDTO;
import com.example.WebSocialMedia_Server.Entity.*;
import com.example.WebSocialMedia_Server.Repository.GroupMemberRepository;
import com.example.WebSocialMedia_Server.Repository.GroupRepository;
import com.example.WebSocialMedia_Server.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Autowired
    private StorageService storageService;

    //Phương thức tạo nhóm
    @Transactional
    public Group createGroup(String username, GroupDTO groupDTO, MultipartFile imageFile) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tạo nhóm mới
        Group group = new Group();
        group.setName(groupDTO.getName());
        group.setDescription(groupDTO.getDescription());
        group.setPrivacy(groupDTO.getPrivacy());
        group.setCreatedBy(user);

        // Lưu ảnh nhóm (nếu có)
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = storageService.storeFile(imageFile); // Lưu ảnh và lấy URL
            group.setImageUrl(imageUrl);
        }

        // Lưu nhóm
        Group savedGroup = groupRepository.save(group);

        // Thêm người tạo vào làm admin của nhóm
        GroupMember groupMember = new GroupMember();
        groupMember.setGroup(savedGroup);
        groupMember.setUser(user);
        groupMember.setRole(GroupRole.ADMIN);
        groupMember.setStatus(RequestStatus.ACCEPTED);

        groupMemberRepository.save(groupMember);

        return savedGroup;
    }

    //Phuương thức thêm người dùng vào nhóm
    @Transactional
    public void joinGroup(Long groupId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // Kiểm tra xem người dùng đã là thành viên chưa
        boolean isMember = groupMemberRepository.existsByGroupAndUser(group, user);
        if (isMember) {
            throw new RuntimeException("You are already a member of this group");
        }

        // Thêm người dùng vào nhóm
        GroupMember groupMember = new GroupMember();
        groupMember.setGroup(group);
        groupMember.setUser(user);
        groupMember.setRole(GroupRole.MEMBER);
        groupMember.setStatus(RequestStatus.PENDING);

        groupMemberRepository.save(groupMember);
    }

    //phương thức duyệt hoặc từ chối thành viên
    @Transactional
    public String handleMembershipRequest(Long groupId, Long memberId, boolean isAccepted, Long adminId) {

        // Kiểm tra nhóm
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // Kiểm tra xem admin có phải là admin của nhóm không
        GroupMember admin = groupMemberRepository.findByGroupIdAndUserIdAndRole(groupId, adminId, GroupRole.ADMIN)
                .orElseThrow(() -> new RuntimeException("Only admins can approve or reject requests"));

        // Tìm thành viên có trạng thái PENDING
        GroupMember member = groupMemberRepository.findByGroupIdAndUserIdAndStatus(groupId, memberId, RequestStatus.PENDING)
                .orElseThrow(() -> new RuntimeException("Membership request not found"));

        // Cập nhật trạng thái
        if (isAccepted) {
            member.setStatus(RequestStatus.ACCEPTED);
        } else {
            member.setStatus(RequestStatus.REJECTED);
        }
        groupMemberRepository.save(member);

        return isAccepted ? "Membership request approved" : "Membership request rejected";
    }

    //Xem danh sách yêu cầu chờ xử lý
    @Transactional
    public List<GroupMember> getPendingRequests(Long groupId, String adminUsername) {
        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // Kiểm tra quyền admin
        GroupMember adminMember = groupMemberRepository.findByGroupAndUser(group, admin)
                .orElseThrow(() -> new RuntimeException("You are not a member of this group"));

        if (adminMember.getRole() != GroupRole.ADMIN) {
            throw new RuntimeException("You are not authorized to view requests.");
        }

        // Lấy danh sách yêu cầu chờ xử lý
        return groupMemberRepository.findByGroupAndStatus(group, RequestStatus.PENDING);
    }

    //danh sach thanh vien bi tu choi vao nhom
    @Transactional
    public List<GroupMember> getRejectedRequests(Long groupId, String adminUsername) {
        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // Kiểm tra quyền admin
        GroupMember adminMember = groupMemberRepository.findByGroupAndUser(group, admin)
                .orElseThrow(() -> new RuntimeException("You are not a member of this group"));

        if (adminMember.getRole() != GroupRole.ADMIN) {
            throw new RuntimeException("You are not authorized to view requests.");
        }

        // Lấy danh sách những người bị từ chối
        return groupMemberRepository.findByGroupAndStatus(group, RequestStatus.REJECTED);
    }

    //admin thêm thành vien vao nhóm
    @Transactional
    public void addMember(Long groupId, String inviterUsername, String inviteeUsername) {
        User inviter = userRepository.findByUsername(inviterUsername)
                .orElseThrow(() -> new RuntimeException("Inviter user not found"));

        User invitee = userRepository.findByUsername(inviteeUsername)
                .orElseThrow(() -> new RuntimeException("Invitee user not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        // Kiểm tra xem inviter có phải là thành viên của nhóm không
        GroupMember inviterMember = groupMemberRepository.findByGroupAndUser(group, inviter)
                .orElseThrow(() -> new RuntimeException("You are not a member of this group"));

        // Kiểm tra quyền mời dựa trên loại nhóm
        if (group.getPrivacy() == GroupPrivacy.PUBLIC) {
            // Nếu nhóm PUBLIC, cả ADMIN và MEMBER đều có thể mời
            if (inviterMember.getRole() != GroupRole.ADMIN && inviterMember.getRole() != GroupRole.MEMBER) {
                throw new RuntimeException("You are not authorized to invite members to this public group");
            }
        } else {
            // Nếu nhóm PRIVATE hoặc SECRET, chỉ ADMIN mới có quyền mời
            if (inviterMember.getRole() != GroupRole.ADMIN) {
                throw new RuntimeException("Only admins can invite members to private or secret groups");
            }
        }


        // Kiểm tra xem invitee đã là thành viên của nhóm chưa
        boolean isAlreadyMember = groupMemberRepository.existsByGroupAndUser(group, invitee);
        if (isAlreadyMember) {
            throw new RuntimeException("User is already a member of this group");
        }

        // Thêm trực tiếp người dùng vào nhóm với trạng thái ACCEPTED
        GroupMember groupMember = new GroupMember();
        groupMember.setGroup(group);
        groupMember.setUser(invitee);
        groupMember.setRole(GroupRole.MEMBER); // Vai trò mặc định là MEMBER
        groupMember.setStatus(RequestStatus.ACCEPTED); // Trạng thái ACCEPTED

        groupMemberRepository.save(groupMember);
    }

    //Thay doi trang thai rejected thanh pending
    @Transactional
    public String changeMemberStatus(Long groupId, Long memberId, String action, Long adminId) {
        // Kiểm tra nhóm có tồn tại không
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // Kiểm tra quyền admin
        GroupMember adminMember = groupMemberRepository.findByGroupAndUser(group, userRepository.findById(adminId)
                        .orElseThrow(() -> new RuntimeException("Admin not found")))
                .orElseThrow(() -> new RuntimeException("You are not a member of this group"));

        if (adminMember.getRole() != GroupRole.ADMIN) {
            throw new RuntimeException("You are not authorized to manage member status");
        }

        // Kiểm tra thành viên có tồn tại trong nhóm không
        GroupMember member = groupMemberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Group member not found"));

        // Kiểm tra trạng thái hiện tại của thành viên
        if (!member.getGroup().getId().equals(groupId)) {
            throw new RuntimeException("Member does not belong to this group");
        }

        if (member.getStatus() != RequestStatus.REJECTED) {
            throw new RuntimeException("Only rejected members can be updated to pending");
        }

        // Thay đổi trạng thái
        if (action.equalsIgnoreCase("pending")) {
            member.setStatus(RequestStatus.PENDING);
            groupMemberRepository.save(member);
            return "Member status updated to PENDING successfully";
        } else {
            throw new RuntimeException("Invalid action. Only 'pending' is allowed for this operation");
        }
    }

    // xem danh sach thanh vien trong nhom
    @Transactional(readOnly = true)
    public List<GroupMemberDTO> getGroupMembers(Long groupId) {
        // Kiểm tra xem nhóm có tồn tại không
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // Lấy danh sách các thành viên có trạng thái ACCEPTED
        List<GroupMember> members = groupMemberRepository.findByGroupIdAndStatus(groupId, RequestStatus.ACCEPTED);

        // Chuyển đổi danh sách GroupMember sang GroupMemberDTO
        return members.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    //Phương thức rời nhóm
    @Transactional
    public void leaveGroup(Long groupId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        GroupMember groupMember = groupMemberRepository.findByGroupAndUser(group, user)
                .orElseThrow(() -> new RuntimeException("You are not a member of this group"));

        // Kiểm tra nếu người dùng là người tạo nhóm
        if (group.getCreatedBy().equals(user)) {
            throw new RuntimeException("Group creator cannot leave the group");
        }
        // Kiểm tra trạng thái phải là ACCEPTED
        if (groupMember.getStatus() != RequestStatus.ACCEPTED) {
            throw new RuntimeException("You can only leave the group if you are an accepted member");
        }

        groupMemberRepository.delete(groupMember);
    }

    //Xóa thành viên
    @Transactional
    public void removeMember(Long groupId, String adminUsername, String memberUsername) {
        User adminUser = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        User memberUser = userRepository.findByUsername(memberUsername)
                .orElseThrow(() -> new RuntimeException("Member user not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // Kiểm tra quyền admin
        GroupMember adminMember = groupMemberRepository.findByGroupAndUser(group, adminUser)
                .orElseThrow(() -> new RuntimeException("You are not a member of this group"));

        if (adminMember.getRole() != GroupRole.ADMIN) {
            throw new RuntimeException("You are not authorized to remove members");
        }


        // Kiểm tra xem người dùng có trong nhóm không
        GroupMember member = groupMemberRepository.findByGroupAndUser(group, memberUser)
                .orElseThrow(() -> new RuntimeException("User is not a member of this group"));
        // Ràng buộc: Không cho phép xóa admin
        if (member.getRole() == GroupRole.ADMIN) {
            throw new RuntimeException("You cannot remove another admin");
        }
        groupMemberRepository.delete(member);
    }

    //Kiểm tra User
    public boolean isMember(Long groupId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        return groupMemberRepository.existsByGroupAndUser(group, user);
    }

    //Chỉnh sửa nhóm
    @Transactional
    public Group updateGroup(Long groupId, String username, GroupDTO groupDTO) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // Kiểm tra quyền admin
        GroupMember adminMember = groupMemberRepository.findByGroupAndUser(group, user)
                .orElseThrow(() -> new RuntimeException("You are not a member of this group"));

        if (adminMember.getRole() != GroupRole.ADMIN) {
            throw new RuntimeException("You are not authorized to update this group");
        }

        // Cập nhật thông tin nhóm
        group.setName(groupDTO.getName());
        group.setDescription(groupDTO.getDescription());
        group.setPrivacy(groupDTO.getPrivacy());

        return groupRepository.save(group);
    }

    // Xóa nhóm
    @Transactional
    public void deleteGroup(Long groupId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // Kiểm tra xem người dùng có phải là người tạo nhóm không
        if (!group.getCreatedBy().equals(user)) {
            throw new RuntimeException("You are not authorized to delete this group");
        }

        groupRepository.delete(group);
    }

    public GroupDTO convertToDTO(Group group) {
        GroupDTO dto = new GroupDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setDescription(group.getDescription());
        dto.setPrivacy(group.getPrivacy());
        dto.setCreatedById(group.getCreatedBy().getId());
        dto.setImageUrl(group.getImageUrl());
        return dto;
    }

    // Phương thức chuyển đổi GroupMember sang GroupMemberDTO
    public GroupMemberDTO convertToDTO(GroupMember groupMember) {
        GroupMemberDTO dto = new GroupMemberDTO();

        dto.setId(groupMember.getId());
        dto.setGroupId(groupMember.getGroup().getId());
        dto.setGroupName(groupMember.getGroup().getName());
        dto.setUserId(groupMember.getUser().getId());
        dto.setUsername(groupMember.getUser().getUsername());
        dto.setFullName(groupMember.getUser().getFullName());
        dto.setAvatarUrl(groupMember.getUser().getAvatarUrl());
        dto.setRole(groupMember.getRole().name());
        dto.setStatus(groupMember.getStatus().name());

        return dto;
    }

    // Phương thức lấy danh sách nhóm PUBLIC
    @Transactional(readOnly = true)
    public List<GroupDTO> getPublicGroups() {
        List<Group> publicGroups = groupRepository.findByPrivacy(GroupPrivacy.PUBLIC);

        // Chuyển đổi danh sách `Group` sang `GroupDTO`
        return publicGroups.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    //phuong thuc doi anh dai dien nhom
    @Transactional
    public GroupDTO updateGroupImage(Long groupId, String adminUsername, MultipartFile imageFile) {
        // Tìm người dùng (admin)
        User adminUser = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        // Tìm nhóm
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // Kiểm tra quyền admin
        GroupMember adminMember = groupMemberRepository.findByGroupAndUser(group, adminUser)
                .orElseThrow(() -> new RuntimeException("You are not a member of this group"));

        if (adminMember.getRole() != GroupRole.ADMIN) {
            throw new RuntimeException("You are not authorized to update the group's image");
        }

        // Kiểm tra và lưu ảnh mới
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = storageService.storeFile(imageFile); // Lưu ảnh và lấy URL
            group.setImageUrl(imageUrl);
        } else {
            throw new RuntimeException("Invalid image file");
        }

        // Cập nhật nhóm
        Group updatedGroup = groupRepository.save(group);

        // Chuyển đổi sang DTO và trả về
        return convertToDTO(updatedGroup);
    }

    @Transactional
    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    @Transactional
    public Group getGroupById(Long groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));
    }


    public boolean isAdmin(Long groupId, String username) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        return group.getCreatedBy().getUsername().equals(username);
    }
}

