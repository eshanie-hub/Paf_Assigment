package com.paf_assigment.paf.post_sharing.repository;

import com.paf_assigment.paf.post_sharing.model.FriendRequest;
import com.paf_assigment.paf.user_management.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    List<FriendRequest> findByReceiver(UserModel receiver);
    List<FriendRequest> findBySender(UserModel sender);
    FriendRequest findBySenderAndReceiver(UserModel sender, UserModel receiver);
}
