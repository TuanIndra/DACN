package com.example.WebSocialMedia_Server.Service;

import com.example.WebSocialMedia_Server.DTO.RoleDTO;
import com.example.WebSocialMedia_Server.DTO.UserDTO;
import com.example.WebSocialMedia_Server.Entity.*;
import com.example.WebSocialMedia_Server.Repository.ResetTokenRepository;
import com.example.WebSocialMedia_Server.Repository.RoleRepository;
import com.example.WebSocialMedia_Server.Repository.UserRepository;

import com.example.WebSocialMedia_Server.Repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResetTokenRepository resetTokenRepository;

    @Autowired
    private StorageService storageService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String DEFAULT_AVATAR_URL = "http://localhost:8082/uploads/default-avatar.png";

    @Transactional
    public UserDTO registerUser(UserDTO userDTO) {
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
                .enabled(false)
                .build();
        // Gán quyền ROLE_USER cho người dùng
        Role userRole = roleRepository.findByRoleName(RoleName.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("User Role not set."));

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);
        // Lưu người dùng vào cơ sở dữ liệu
        User savedUser = userRepository.save(user);

        // Tạo mã xác thực
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(token, savedUser);
        tokenRepository.save(verificationToken);

        // Gửi email xác thực
        emailService.sendVerificationEmail(savedUser.getEmail(), token);

        // Chuyển đổi User sang UserDTO và trả về
        return convertToDTO(savedUser);
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
    //Phuong thuc sua avatar
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

    // Phương thức kích hoạt tài khoản khi người dùng xác thực email
    @Transactional
    public String verifyAccount(String token) {
        VerificationToken verificationToken = tokenRepository.findByToken(token);
        if (verificationToken == null) {
            return "Invalid token.";
        }

        User user = verificationToken.getUser();
        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return "Token expired.";
        }

        user.setEnabled(true);
        userRepository.save(user);

        return "Account verified successfully!";
    }

    //doi mat khau
    @Transactional
    public void changePassword(String username, String oldPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Kiểm tra mật khẩu cũ
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        // Cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    //quen mk
    @Transactional
    public void sendResetPasswordEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        // Tạo token reset mật khẩu
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(15);

        // Xóa token cũ nếu có
        resetTokenRepository.deleteByUser(user);

        ResetToken resetToken = new ResetToken(token, user, expiryDate);
        resetTokenRepository.save(resetToken);

        // Gửi email
        String resetLink = "http://localhost:8082/api/auth/reset-password?token=" + token;
        emailService.sendSimpleMessage(user.getEmail(), "Password Reset Request",
                "Click the link below to reset your password:\n" + resetLink);
    }

    //reset mk
    @Transactional
    public void resetPassword(String token, String newPassword) {
        ResetToken resetToken = resetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Xóa token sau khi sử dụng
        resetTokenRepository.delete(resetToken);
    }

    //doi thong tin co ban cua user
    @Transactional
    public UserDTO updateUserInfo(String username, String newFullName, String newBio) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Cập nhật thông tin
        if (newFullName != null && !newFullName.trim().isEmpty()) {
            user.setFullName(newFullName);
        }

        if (newBio != null && newBio.length() <= 255) {
            user.setBio(newBio);
        }

        User updatedUser = userRepository.save(user);

        // Chuyển đổi sang UserDTO và trả về
        return convertToDTO(updatedUser);
    }

}
