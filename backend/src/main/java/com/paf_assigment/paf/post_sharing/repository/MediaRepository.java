package com.paf_assigment.paf.post_sharing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.paf_assigment.paf.post_sharing.model.Media;
import com.paf_assigment.paf.post_sharing.model.Post;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {
    List<Media> findByPost(Post post);
    long countByPost(Post post);
}
