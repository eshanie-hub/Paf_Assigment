package com.paf_assigment.paf.user_management.Service;

import com.paf_assigment.paf.post_sharing.service.CloudinaryService;
import com.paf_assigment.paf.user_management.dto.ProfileUpdateRequest;
import com.paf_assigment.paf.user_management.model.UserModel;
import com.paf_assigment.paf.user_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    public UserModel getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<UserModel> getAllUsers() {
        return userRepository.findAll();
    }

    public Map<String, Object> updateUserProfile(Long userId, ProfileUpdateRequest request) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getUsername() != null && !request.getUsername().isEmpty()) {
            user.setUsername(request.getUsername());
        }

        if (request.getProfilePhoto() != null && !request.getProfilePhoto().isEmpty()) {
            try {
                // Delete old photo if exists
                if (user.getProfilePhotoPublicId() != null) {
                    cloudinaryService.deleteFile(user.getProfilePhotoUrl());
                }

                // Upload new photo
                String photoUrl = cloudinaryService.uploadFile(request.getProfilePhoto(), false);
                
                user.setProfilePhotoUrl(photoUrl);
                user.setProfilePhotoPublicId(cloudinaryService.extractPublicIdFromUrl(photoUrl));
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload profile photo", e);
            }
        }

        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Profile updated successfully");
        response.put("user", user);
        return response;
    }

    public void followUser(Long userId, Long targetUserId) {
        // Implement your follow logic here
        // This might involve a separate Follow entity/table
    }

    public void unfollowUser(Long userId, Long targetUserId) {
        // Implement your unfollow logic here
    }
}