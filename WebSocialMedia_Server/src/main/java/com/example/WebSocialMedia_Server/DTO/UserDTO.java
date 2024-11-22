package com.example.WebSocialMedia_Server.DTO;

import lombok.Data;

import java.util.Set;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String avatarUrl;
    private String bio;
    private Set<RoleDTO> roles;


    public String getPassword() {
        return password;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

}

