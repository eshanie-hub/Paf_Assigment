package com.paf_assigment.paf.post_sharing.repository;

import com.paf_assigment.paf.post_sharing.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    @Query("SELECT p FROM Post p LEFT JOIN FETCH p.media ORDER BY p.createdAt DESC")
    List<Post> findAllPostsWithMedia();
}