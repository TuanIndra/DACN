package com.example.WebSocialMedia_Server.DTO;

import lombok.Data;

@Data
public class MediaDTO {
    private Long id;
    private String url;
    private String mediaType;

    public void setUrl(String url) {
        this.url = url;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

}
