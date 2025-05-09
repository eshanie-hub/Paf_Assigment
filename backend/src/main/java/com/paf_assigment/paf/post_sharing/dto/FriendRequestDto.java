package com.paf_assigment.paf.post_sharing.dto;

import java.time.LocalDateTime;

public class FriendRequestDto {
    private Long id;

    private Long senderId;
    private String senderUsername;
    private String senderProfilePhotoUrl;

    private Long receiverId;
    private String receiverUsername;
    private String receiverProfilePhotoUrl;

    private String status; // e.g., "pending", "accepted", "rejected"
    private LocalDateTime createdAt;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getSenderUsername() {
        return senderUsername;
    }

    public void setSenderUsername(String senderUsername) {
        this.senderUsername = senderUsername;
    }

    public String getSenderProfilePhotoUrl() {
        return senderProfilePhotoUrl;
    }

    public void setSenderProfilePhotoUrl(String senderProfilePhotoUrl) {
        this.senderProfilePhotoUrl = senderProfilePhotoUrl;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getReceiverUsername() {
        return receiverUsername;
    }

    public void setReceiverUsername(String receiverUsername) {
        this.receiverUsername = receiverUsername;
    }

    public String getReceiverProfilePhotoUrl() {
        return receiverProfilePhotoUrl;
    }

    public void setReceiverProfilePhotoUrl(String receiverProfilePhotoUrl) {
        this.receiverProfilePhotoUrl = receiverProfilePhotoUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
