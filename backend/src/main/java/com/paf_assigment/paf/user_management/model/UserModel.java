package com.paf_assigment.paf.user_management.model;

import jakarta.persistence.*;
import java.util.List;
import com.paf_assigment.paf.post_sharing.model.FriendRequest;

@Entity
@Table(name = "users")
public class UserModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String password;
    private String profilePhotoUrl;
    private String profilePhotoPublicId;

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FriendRequest> sentRequests;

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FriendRequest> receivedRequests;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }

    public String getProfilePhotoPublicId() { return profilePhotoPublicId; }
    public void setProfilePhotoPublicId(String profilePhotoPublicId) { this.profilePhotoPublicId = profilePhotoPublicId; }

    public List<FriendRequest> getSentRequests() { return sentRequests; }
    public void setSentRequests(List<FriendRequest> sentRequests) { this.sentRequests = sentRequests; }

    public List<FriendRequest> getReceivedRequests() { return receivedRequests; }
    public void setReceivedRequests(List<FriendRequest> receivedRequests) { this.receivedRequests = receivedRequests; }
}
