package com.example.WebSocialMedia_Server.Service;

import com.example.WebSocialMedia_Server.DTO.RoleDTO;
import com.example.WebSocialMedia_Server.DTO.UserDTO;
import com.example.WebSocialMedia_Server.Entity.Role;
import com.example.WebSocialMedia_Server.Entity.RoleName;
import com.example.WebSocialMedia_Server.Entity.User;
import com.example.WebSocialMedia_Server.Repository.RoleRepository;
import com.example.WebSocialMedia_Server.Repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StorageService storageService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String DEFAULT_AVATAR_URL = "http://localhost:8082/uploads/default-avatar.png";

    @Transactional
    public User registerUser(UserDTO userDTO) {
        // Kiểm tra xem username hoặc email đã tồn tại chưa
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new RuntimeException("Tên người dùng đã tồn tại");
        }
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }


        // Tạo đối tượng User mới
        User user = User.builder()
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .password(passwordEncoder.encode(userDTO.getPassword())) // Mã hóa mật khẩu
                .fullName(userDTO.getFullName())
                .avatarUrl(DEFAULT_AVATAR_URL)
                .build();
        // Gán quyền ROLE_USER cho người dùng
        Role userRole = roleRepository.findByRoleName(RoleName.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("User Role not set."));

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);
        // Lưu vào cơ sở dữ liệu
        return userRepository.save(user);
    }
    // Phương thức chuyển đổi User thành UserDTO
    public UserDTO convertToDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setFullName(user.getFullName());
        userDTO.setAvatarUrl(user.getAvatarUrl());
        userDTO.setBio(user.getBio());
        // Không bao gồm mật khẩu và email để bảo mật

        // Chuyển đổi roles
        Set<RoleDTO> roleDTOs = user.getRoles().stream().map(role -> {
            RoleDTO roleDTO = new RoleDTO();
            roleDTO.setId(role.getId());
            roleDTO.setRoleName(role.getRoleName().name());
            roleDTO.setDescription(role.getDescription());
            return roleDTO;
        }).collect(Collectors.toSet());
        userDTO.setRoles(roleDTOs);

        return userDTO;
    }
    public UserDTO updateAvatar(String username, MultipartFile file) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Xử lý lưu trữ file và lấy URL
        String avatarUrl = storageService.storeFile(file);

        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);

        return convertToDTO(user);
    }

    @Transactional
    public UserDTO findByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Chuyển đổi User sang UserDTO
        return convertToDTO(user);
    }
}
