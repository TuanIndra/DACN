package com.example.WebSocialMedia_Server.Controller;

import com.example.WebSocialMedia_Server.DTO.LoginDTO;
import com.example.WebSocialMedia_Server.DTO.UpdateUserInfoDTO;
import com.example.WebSocialMedia_Server.DTO.UserDTO;
import com.example.WebSocialMedia_Server.Entity.User;
import com.example.WebSocialMedia_Server.Entity.VerificationToken;
import com.example.WebSocialMedia_Server.Repository.UserRepository;
import com.example.WebSocialMedia_Server.Repository.VerificationTokenRepository;
import com.example.WebSocialMedia_Server.Service.EmailService;
import com.example.WebSocialMedia_Server.Service.UserService;
import com.example.WebSocialMedia_Server.Util.JwtTokenProvider;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // Endpoint xác thực tài khoản
    @GetMapping("/verify")
    public ResponseEntity<String> verifyAccount(@RequestParam("token") String token) {
        String result = userService.verifyAccount(token);
        if (result.equals("Account verified successfully!")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    //gui lai otp
    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerificationToken(@RequestBody String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isEnabled()) {
            return ResponseEntity.badRequest().body("Account is already verified.");
        }

        // Tạo mã xác thực mới
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(token, user);
        tokenRepository.save(verificationToken);

        // Gửi email xác thực
        emailService.sendVerificationEmail(user.getEmail(), token);

        return ResponseEntity.ok("Verification email sent.");
    }

    // Endpoint đăng ký (đã có)
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        try {
            UserDTO registeredUser = userService.registerUser(userDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
        } catch (Exception e) {
            // Trả về thông báo lỗi chi tiết
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Endpoint đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginDTO loginDTO) {
        // Tìm User dựa trên username hoặc email
        User user = userRepository.findByUsernameOrEmail(loginDTO.getUsernameOrEmail(), loginDTO.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("User not found with username or email: " + loginDTO.getUsernameOrEmail()));

        // Xác thực thông tin đăng nhập
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        loginDTO.getPassword()
                )
        );

        // Đặt thông tin xác thực vào ngữ cảnh bảo mật
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Tạo JWT token
        String jwt = jwtTokenProvider.generateToken(authentication);

        // Tạo response bao gồm token và thông tin người dùng
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("userId", user.getId()); // Thêm userId vào response
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("fullName", user.getFullName());

        return ResponseEntity.ok(response);
    }
    @GetMapping("/reset-password")
    public ResponseEntity<String> resetPasswordPage(@RequestParam("token") String token) {
        // Redirect người dùng đến trang frontend để nhập mật khẩu mới
        String frontendResetUrl = "http://26.159.243.47:5173/reset-password?token=" + token;
        return ResponseEntity.status(HttpStatus.FOUND).header("Location", frontendResetUrl).build();
    }

    //doi anh dai dienss
    @PutMapping("/avatar")
    public ResponseEntity<UserDTO> updateAvatar(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        String username = authentication.getName();

        // Gọi service để xử lý cập nhật avatar
        UserDTO updatedUser = userService.updateAvatar(username, file);

        // Đảm bảo không có lỗi dư đường dẫn "/uploads/"
        if (updatedUser.getAvatarUrl() != null && updatedUser.getAvatarUrl().startsWith("/uploads/uploads/")) {
            updatedUser.setAvatarUrl(updatedUser.getAvatarUrl().replaceFirst("/uploads/uploads/", "/uploads/"));
        }

        return ResponseEntity.ok(updatedUser);
    }


    //doi mat khau
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestParam String oldPassword,
            @RequestParam String newPassword,
            Authentication authentication) {

        String username = authentication.getName();
        userService.changePassword(username, oldPassword, newPassword);
        return ResponseEntity.ok("Password updated successfully");
    }

    // Gửi yêu cầu quên mật khẩu
        @PostMapping("/forgot-password")
        public ResponseEntity<String> forgotPassword(@RequestParam String email) {
            userService.sendResetPasswordEmail(email);
            return ResponseEntity.ok("Password reset link sent to your email");
        }

        // Đặt lại mật khẩu
        @PostMapping("/reset-password")
        public ResponseEntity<String> resetPassword(
                @RequestParam String token,
                @RequestParam String newPassword) {
            userService.resetPassword(token, newPassword);
            return ResponseEntity.ok("Password has been reset successfully");
        }


    //doi thong tin co ban cua user
        @PutMapping("/update-info")
        public ResponseEntity<UserDTO> updateUserInfo(
                @RequestBody UpdateUserInfoDTO updateUserInfoDTO,
                Authentication authentication) {

            String username = authentication.getName();

            UserDTO updatedUser = userService.updateUserInfo(
                    username,
                    updateUserInfoDTO.getFullName(),
                    updateUserInfoDTO.getBio()
            );

            return ResponseEntity.ok(updatedUser);
        }
}

