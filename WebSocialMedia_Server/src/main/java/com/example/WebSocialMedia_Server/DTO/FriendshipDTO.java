package com.example.WebSocialMedia_Server.DTO;

import com.example.WebSocialMedia_Server.Entity.FriendshipStatus;
import lombok.Data;

@Data
public class FriendshipDTO {
    private Long id;
    private UserDTO requester;
    private UserDTO addressee;
    private FriendshipStatus status;

    public UserDTO getAddressee() {
        return addressee;
    }

    public UserDTO getRequester() {
        return requester;
    }

    public void setAddressee(UserDTO addressee) {
        this.addressee = addressee;
    }

    public void setRequester(UserDTO requester) {
        this.requester = requester;
    }
}
