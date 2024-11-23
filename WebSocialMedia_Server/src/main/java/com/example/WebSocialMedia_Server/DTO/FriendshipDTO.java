package com.example.WebSocialMedia_Server.DTO;

import com.example.WebSocialMedia_Server.Entity.FriendshipStatus;
import lombok.Data;

@Data
public class FriendshipDTO {
    private Long id;
    private UserDTO requester;
    private UserDTO addressee;
    private FriendshipStatus status;

}
