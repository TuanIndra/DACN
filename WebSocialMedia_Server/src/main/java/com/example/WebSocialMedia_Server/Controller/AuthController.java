package com.example.WebSocialMedia_Server.Controller;

import com.example.WebSocialMedia_Server.DTO.LoginDTO;
import com.example.WebSocialMedia_Server.DTO.UserDTO;
import com.example.WebSocialMedia_Server.Entity.User;
import com.example.WebSocialMedia_Server.Service.UserService;
import com.example.WebSocialMedia_Server.Util.JwtTokenProvider;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // Endpoint đăng ký (đã có)
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody UserDTO userDTO) {
        User newUser = userService.registerUser(userDTO);
        return ResponseEntity.ok(newUser);
    }

    // Endpoint đăng nhập
    @PostMapping("/login")

    public ResponseEntity<?> authenticateUser(@RequestBody LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getUsername(),
                        loginDTO.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtTokenProvider.generateToken(authentication);
        return ResponseEntity.ok(jwt);
    }
    @PutMapping("/avatar")
    public ResponseEntity<UserDTO> updateAvatar(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        String username = authentication.getName();
        UserDTO updatedUser = userService.updateAvatar(username, file);

        return ResponseEntity.ok(updatedUser);
    }
}

