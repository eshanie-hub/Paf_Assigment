package com.paf_assigment.paf.post_sharing.service;

import com.paf_assigment.paf.post_sharing.dto.LikeResponseDto;
import com.paf_assigment.paf.post_sharing.model.Like;
import com.paf_assigment.paf.post_sharing.model.Post;
import com.paf_assigment.paf.post_sharing.repository.LikeRepository;
import com.paf_assigment.paf.post_sharing.repository.PostRepository;
import com.paf_assigment.paf.user_management.model.UserModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LikeService {
    private final LikeRepository likeRepository;
    private final PostRepository postRepository;

    public LikeService(LikeRepository likeRepository, PostRepository postRepository) {
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
    }

    @Transactional
    public void likePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));
        UserModel user = getCurrentUser();
        if (likeRepository.findByPostAndUser(post, user).isPresent()) {
            throw new IllegalArgumentException("Already liked");
        }
        Like like = new Like();
        like.setPost(post);
        like.setUser(user);
        likeRepository.save(like);
    }

    @Transactional
    public void unlikePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));
        UserModel user = getCurrentUser();
        likeRepository.findByPostAndUser(post, user)
                .ifPresent(likeRepository::delete);
    }

    public List<LikeResponseDto> getLikesByPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));
        return likeRepository.findByPost(post).stream()
                .map(like -> {
                    LikeResponseDto dto = new LikeResponseDto();
                    dto.setUserId(like.getUser().getId());
                    dto.setUsername(like.getUser().getUsername());
                    dto.setProfilePhotoUrl(like.getUser().getProfilePhotoUrl());
                    return dto;
                }).collect(Collectors.toList());
    }

    private UserModel getCurrentUser() {
        // Example: return userRepository.findById(1L).orElseThrow();
        throw new UnsupportedOperationException("Implement getCurrentUser() based on your authentication");
    }
}
