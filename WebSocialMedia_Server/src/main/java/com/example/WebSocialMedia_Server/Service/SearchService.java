package com.example.WebSocialMedia_Server.Service;

import com.example.WebSocialMedia_Server.DTO.GroupDTO;
import com.example.WebSocialMedia_Server.DTO.UserDTO;
import com.example.WebSocialMedia_Server.Entity.Group;
import com.example.WebSocialMedia_Server.Entity.GroupPrivacy;
import com.example.WebSocialMedia_Server.Entity.User;
import com.example.WebSocialMedia_Server.Repository.GroupRepository;
import com.example.WebSocialMedia_Server.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SearchService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    public Map<String, Object> search(String keyword) {
        // Tìm người dùng
        List<User> users = userRepository.findByFullNameContainingIgnoreCaseOrUsernameContainingIgnoreCase(keyword, keyword);
        List<UserDTO> userDTOs = users.stream().map(this::convertUserToDTO).collect(Collectors.toList());

        // Tìm nhóm PUBLIC và PRIVATE
        List<GroupPrivacy> allowedPrivacies = Arrays.asList(GroupPrivacy.PUBLIC, GroupPrivacy.PRIVATE);
        List<Group> groups = groupRepository.findByNameContainingIgnoreCaseAndPrivacyIn(keyword, allowedPrivacies);
        List<GroupDTO> groupDTOs = groups.stream().map(this::convertGroupToDTO).collect(Collectors.toList());

        // Kết hợp kết quả
        Map<String, Object> result = new HashMap<>();
        result.put("users", userDTOs);
        result.put("groups", groupDTOs);

        return result;
    }

    private UserDTO convertUserToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        return dto;
    }

    private GroupDTO convertGroupToDTO(Group group) {
        GroupDTO dto = new GroupDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setDescription(group.getDescription());
        dto.setPrivacy(group.getPrivacy());
        return dto;
    }
}
