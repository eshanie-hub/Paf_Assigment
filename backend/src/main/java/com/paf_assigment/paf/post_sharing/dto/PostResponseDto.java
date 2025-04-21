package com.paf_assigment.paf.post_sharing.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PostResponseDto {
    private Long id;
    private String description;
    private String visibility;
    private LocalDateTime createdAt;
    private List<MediaResponseDto> media;
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getVisibility() {
        return visibility;
    }
    
    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public List<MediaResponseDto> getMedia() {
        return media;
    }
    
    public void setMedia(List<MediaResponseDto> media) {
        this.media = media;
    }
    
    public static class MediaResponseDto {
        private Long id;
        private String url;
        private String mediaType;
        private String description;
        
        // Getters and Setters
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getUrl() {
            return url;
        }
        
        public void setUrl(String url) {
            this.url = url;
        }
        
        public String getMediaType() {
            return mediaType;
        }
        
        public void setMediaType(String mediaType) {
            this.mediaType = mediaType;
        }
        
        public String getDescription() {
            return description;
        }
        
        public void setDescription(String description) {
            this.description = description;
        }
    }
}
