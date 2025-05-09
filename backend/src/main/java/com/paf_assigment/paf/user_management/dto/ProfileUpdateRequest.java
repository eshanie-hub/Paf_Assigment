package com.paf_assigment.paf.user_management.dto;

import org.springframework.web.multipart.MultipartFile;

public class ProfileUpdateRequest {
    private String username;
    private MultipartFile profilePhoto;

    // Getters & Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public MultipartFile getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(MultipartFile profilePhoto) {
        this.profilePhoto = profilePhoto;
    }
}