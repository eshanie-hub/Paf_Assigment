package com.paf_assigment.paf.post_sharing.service;

import com.paf_assigment.paf.post_sharing.dto.FriendRequestDto;
import com.paf_assigment.paf.post_sharing.model.FriendRequest;
import com.paf_assigment.paf.post_sharing.repository.FriendRequestRepository;
import com.paf_assigment.paf.user_management.model.UserModel;
import com.paf_assigment.paf.user_management.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FriendRequestService {
    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;

    public FriendRequestService(FriendRequestRepository friendRequestRepository, UserRepository userRepository) {
        this.friendRequestRepository = friendRequestRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void sendRequest(Long receiverId) {
        UserModel sender = getCurrentUser();
        UserModel receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + receiverId));
        if (friendRequestRepository.findBySenderAndReceiver(sender, receiver) != null) {
            throw new IllegalArgumentException("Request already sent");
        }
        FriendRequest req = new FriendRequest();
        req.setSender(sender);
        req.setReceiver(receiver);
        req.setStatus("pending");
        req.setCreatedAt(LocalDateTime.now());
        friendRequestRepository.save(req);
    }

    @Transactional
    public void acceptRequest(Long requestId) {
        FriendRequest req = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));
        req.setStatus("accepted");
        friendRequestRepository.save(req);
        // Optionally, add to friends list, etc.
    }

    @Transactional
    public void rejectRequest(Long requestId) {
        FriendRequest req = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));
        req.setStatus("rejected");
        friendRequestRepository.save(req);
    }

    public List<FriendRequestDto> getReceivedRequests() {
        UserModel user = getCurrentUser();
        return friendRequestRepository.findByReceiver(user).stream()
                .map(this::convertToDto).collect(Collectors.toList());
    }

    public List<FriendRequestDto> getSentRequests() {
        UserModel user = getCurrentUser();
        return friendRequestRepository.findBySender(user).stream()
                .map(this::convertToDto).collect(Collectors.toList());
    }

    private FriendRequestDto convertToDto(FriendRequest req) {
        FriendRequestDto dto = new FriendRequestDto();
        dto.setId(req.getId());
        dto.setSenderId(req.getSender().getId());
        dto.setSenderUsername(req.getSender().getUsername());
        dto.setSenderProfilePhotoUrl(req.getSender().getProfilePhotoUrl());
        dto.setReceiverId(req.getReceiver().getId());
        dto.setReceiverUsername(req.getReceiver().getUsername());
        dto.setReceiverProfilePhotoUrl(req.getReceiver().getProfilePhotoUrl());
        dto.setStatus(req.getStatus());
        dto.setCreatedAt(req.getCreatedAt());
        return dto;
    }

    private UserModel getCurrentUser() {
        // Example: return userRepository.findById(1L).orElseThrow();
        throw new UnsupportedOperationException("Implement getCurrentUser() based on your authentication");
    }
}
