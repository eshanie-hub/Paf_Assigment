package com.paf_assigment.paf.post_sharing.service;

import com.paf_assigment.paf.post_sharing.dto.CommentCreateDto;
import com.paf_assigment.paf.post_sharing.dto.CommentResponseDto;
import com.paf_assigment.paf.post_sharing.model.Comment;
import com.paf_assigment.paf.post_sharing.model.Post;
import com.paf_assigment.paf.post_sharing.repository.CommentRepository;
import com.paf_assigment.paf.post_sharing.repository.PostRepository;
import com.paf_assigment.paf.user_management.model.UserModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }

    @Transactional
    public CommentResponseDto addComment(Long postId, CommentCreateDto dto) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));
        UserModel author = getCurrentUser();

        Comment comment = new Comment();
        comment.setContent(dto.getContent());
        comment.setAuthor(author);
        comment.setPost(post);
        comment.setCreatedAt(LocalDateTime.now());

        Comment saved = commentRepository.save(comment);
        return convertToDto(saved);
    }

    public List<CommentResponseDto> getCommentsByPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));
        List<Comment> comments = commentRepository.findByPostOrderByCreatedAtAsc(post);
        return comments.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Transactional
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    private CommentResponseDto convertToDto(Comment comment) {
        CommentResponseDto dto = new CommentResponseDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        if (comment.getAuthor() != null) {
            CommentResponseDto.AuthorDto authorDto = new CommentResponseDto.AuthorDto();
            authorDto.setId(comment.getAuthor().getId());
            authorDto.setUsername(comment.getAuthor().getUsername());
            authorDto.setProfilePhotoUrl(comment.getAuthor().getProfilePhotoUrl());
            dto.setAuthor(authorDto);
        }
        return dto;
    }

    private UserModel getCurrentUser() {
        // Example: return userRepository.findById(1L).orElseThrow();
        throw new UnsupportedOperationException("Implement getCurrentUser() based on your authentication");
    }
}
