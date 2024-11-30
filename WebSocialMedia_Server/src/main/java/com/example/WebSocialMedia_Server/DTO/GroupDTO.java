package com.example.WebSocialMedia_Server.DTO;

import com.example.WebSocialMedia_Server.Entity.GroupPrivacy;
import lombok.Data;

@Data
public class GroupDTO {
    private Long id;
    private String name;
    private String description;
    private GroupPrivacy privacy;
    private Long createdById;
    private String imageUrl;
}