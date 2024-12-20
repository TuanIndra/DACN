package com.example.WebSocialMedia_Server.DTO;

import lombok.Data;

@Data
public class LoginDTO {
    private String usernameOrEmail;
    private String password;
}
