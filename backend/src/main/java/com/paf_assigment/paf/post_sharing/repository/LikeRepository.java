package com.paf_assigment.paf.post_sharing.repository;

import com.paf_assigment.paf.post_sharing.model.Like;
import com.paf_assigment.paf.post_sharing.model.Post;
import com.paf_assigment.paf.user_management.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    List<Like> findByPost(Post post);
    long countByPost(Post post);
    Optional<Like> findByPostAndUser(Post post, UserModel user);
}
