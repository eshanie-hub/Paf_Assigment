package com.paf_assigment.paf.post_sharing.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PostResponseDto {
    private Long id;
    private String description;
    private String visibility;
    private LocalDateTime createdAt;
    private AuthorDto author;
    private List<MediaResponseDto> media;
    private List<CommentResponseDto> comments;
    private int likeCount;
    private List<LikeResponseDto> likes;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public AuthorDto getAuthor() { return author; }
    public void setAuthor(AuthorDto author) { this.author = author; }

    public List<MediaResponseDto> getMedia() { return media; }
    public void setMedia(List<MediaResponseDto> media) { this.media = media; }

    public List<CommentResponseDto> getComments() { return comments; }
    public void setComments(List<CommentResponseDto> comments) { this.comments = comments; }

    public int getLikeCount() { return likeCount; }
    public void setLikeCount(int likeCount) { this.likeCount = likeCount; }

    public List<LikeResponseDto> getLikes() { return likes; }
    public void setLikes(List<LikeResponseDto> likes) { this.likes = likes; }

    public static class AuthorDto {
        private Long id;
        private String username;
        private String profilePhotoUrl;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getProfilePhotoUrl() { return profilePhotoUrl; }
        public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }
    }

    public static class MediaResponseDto {
        private Long id;
        private String url;
        private String mediaType;
        private String description;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }

        public String getMediaType() { return mediaType; }
        public void setMediaType(String mediaType) { this.mediaType = mediaType; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
}
