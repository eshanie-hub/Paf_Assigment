package com.paf_assigment.paf.post_sharing.repository;

import com.paf_assigment.paf.post_sharing.model.Comment;
import com.paf_assigment.paf.post_sharing.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostOrderByCreatedAtAsc(Post post);
    long countByPost(Post post);
}
