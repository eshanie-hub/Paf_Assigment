package com.paf_assigment.paf.user_management.controller;

import com.paf_assigment.paf.user_management.Service.UserService;
import com.paf_assigment.paf.user_management.dto.ProfileUpdateRequest;
import com.paf_assigment.paf.user_management.model.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserModel> getUserProfile(@PathVariable Long userId) {
        UserModel user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserModel>> getAllUsers() {
        List<UserModel> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @PathVariable Long userId,
            @ModelAttribute ProfileUpdateRequest request) {
        Map<String, Object> response = userService.updateUserProfile(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{userId}/follow/{targetUserId}")
    public ResponseEntity<Map<String, String>> followUser(
            @PathVariable Long userId,
            @PathVariable Long targetUserId) {
        userService.followUser(userId, targetUserId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Successfully followed user");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{userId}/unfollow/{targetUserId}")
    public ResponseEntity<Map<String, String>> unfollowUser(
            @PathVariable Long userId,
            @PathVariable Long targetUserId) {
        userService.unfollowUser(userId, targetUserId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Successfully unfollowed user");
        return ResponseEntity.ok(response);
    }
}