package com.paf_assigment.paf.post_sharing.controller;

import com.paf_assigment.paf.post_sharing.dto.FriendRequestDto;
import com.paf_assigment.paf.post_sharing.service.FriendRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;

@RestController
@RequestMapping("/api/friend-requests")
@CrossOrigin(origins = "http://localhost:3000")
public class FriendRequestController {

    private final FriendRequestService friendRequestService;
    public FriendRequestController(FriendRequestService friendRequestService) {
        this.friendRequestService = friendRequestService;
    }

    @PostMapping("/send/{receiverId}")
    public ResponseEntity<?> sendRequest(@PathVariable Long receiverId) {
        friendRequestService.sendRequest(receiverId);
        return ResponseEntity.ok().body("Friend request sent");
    }

    @PostMapping("/accept/{requestId}")
    public ResponseEntity<?> acceptRequest(@PathVariable Long requestId) {
        friendRequestService.acceptRequest(requestId);
        return ResponseEntity.ok().body("Friend request accepted");
    }

    @PostMapping("/reject/{requestId}")
    public ResponseEntity<?> rejectRequest(@PathVariable Long requestId) {
        friendRequestService.rejectRequest(requestId);
        return ResponseEntity.ok().body("Friend request rejected");
    }

    @GetMapping("/received")
    public ResponseEntity<List<FriendRequestDto>> getReceivedRequests() {
        return ResponseEntity.ok(friendRequestService.getReceivedRequests());
    }

    @GetMapping("/sent")
    public ResponseEntity<List<FriendRequestDto>> getSentRequests() {
        return ResponseEntity.ok(friendRequestService.getSentRequests());
    }
}
