package com.paf_assigment.paf.post_sharing.service;

import com.paf_assigment.paf.post_sharing.dto.*;
import com.paf_assigment.paf.post_sharing.model.Media;
import com.paf_assigment.paf.post_sharing.model.Post;
import com.paf_assigment.paf.post_sharing.repository.MediaRepository;
import com.paf_assigment.paf.post_sharing.repository.PostRepository;
import com.paf_assigment.paf.user_management.model.UserModel;
import com.paf_assigment.paf.user_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final MediaRepository mediaRepository;
    private final CloudinaryService cloudinaryService;
    private final UserRepository userRepository;

    @Value("${app.media.max-count:3}")
    private int maxMediaCount;

    public PostService(PostRepository postRepository, MediaRepository mediaRepository,
                       CloudinaryService cloudinaryService,
                       UserRepository userRepository) {
        this.postRepository = postRepository;
        this.mediaRepository = mediaRepository;
        this.cloudinaryService = cloudinaryService;
        this.userRepository = userRepository;
    }

    @Transactional
    public PostResponseDto createPost(PostCreateDto postDto) throws IOException {
        if (postDto.getDescription() == null || postDto.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Description is required");
        }
        Post post = new Post();
        post.setDescription(postDto.getDescription());
        post.setVisibility(postDto.getVisibility() != null ? postDto.getVisibility() : "public");
        post.setAuthor(getCurrentUser()); // Fetch the currently authenticated user

        List<Media> mediaList = new ArrayList<>();
        if (postDto.getMediaFiles() != null && !postDto.getMediaFiles().isEmpty()) {
            mediaList = processMediaFiles(postDto.getMediaFiles(), post);
            post.setMedia(mediaList);
        }
        Post savedPost = postRepository.save(post);
        return convertToDto(savedPost);
    }

    @Transactional
    public PostResponseDto updatePost(Long postId, PostUpdateDto updateDto) throws IOException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));
        if (updateDto.getDescription() != null) post.setDescription(updateDto.getDescription());
        if (updateDto.getVisibility() != null) post.setVisibility(updateDto.getVisibility());

        // Delete media files
        if (updateDto.getMediaToDelete() != null && !updateDto.getMediaToDelete().isEmpty()) {
            List<Media> mediaToRemove = new ArrayList<>();
            for (Long mediaId : updateDto.getMediaToDelete()) {
                Optional<Media> mediaOpt = post.getMedia().stream()
                        .filter(m -> m.getId().equals(mediaId)).findFirst();
                mediaOpt.ifPresent(media -> {
                    try { cloudinaryService.deleteFile(media.getUrl()); }
                    catch (Exception e) { System.err.println("Warning: Failed to delete media: " + e.getMessage()); }
                    mediaToRemove.add(media);
                });
            }
            post.getMedia().removeAll(mediaToRemove);
            mediaRepository.deleteAll(mediaToRemove);
        }

        // Add new media files
        if (updateDto.getNewMediaFiles() != null && !updateDto.getNewMediaFiles().isEmpty()) {
            List<Media> newMedia = processMediaFiles(updateDto.getNewMediaFiles(), post);
            if (post.getMedia() == null) post.setMedia(new ArrayList<>());
            post.getMedia().addAll(newMedia);
        }
        Post updatedPost = postRepository.save(post);
        return convertToDto(updatedPost);
    }

    @Transactional
    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));
        if (post.getMedia() != null) {
            for (Media media : post.getMedia()) {
                try { cloudinaryService.deleteFile(media.getUrl()); }
                catch (Exception e) { System.err.println("Failed to delete media: " + media.getUrl()); }
            }
        }
        postRepository.deleteById(postId);
    }

    @Transactional
    public PostResponseDto updateVisibility(Long postId, String visibility) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));
        post.setVisibility(visibility);
        Post updatedPost = postRepository.save(post);
        return convertToDto(updatedPost);
    }

    public List<PostResponseDto> getAllPosts() {
        return postRepository.findAllPostsWithMedia().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public PostResponseDto getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));
        return convertToDto(post);
    }

    private List<Media> processMediaFiles(List<MediaUploadDto> mediaUploadDtos, Post post) throws IOException {
        List<Media> mediaList = new ArrayList<>();
        for (MediaUploadDto mediaDto : mediaUploadDtos) {
            MultipartFile file = mediaDto.getFile();
            if (file == null || file.isEmpty()) continue;
            String contentType = file.getContentType();
            if (contentType == null) throw new IllegalArgumentException("File type cannot be determined");
            boolean isVideo = contentType.startsWith("video/");
            boolean isImage = contentType.startsWith("image/");
            if (!isVideo && !isImage) throw new IllegalArgumentException("Unsupported file type: " + contentType);
            String url = cloudinaryService.uploadFile(file, isVideo);
            Media media = new Media();
            media.setUrl(url);
            media.setMediaType(isVideo ? "video" : "image");
            media.setPost(post);
            mediaList.add(media);
        }
        return mediaList;
    }

    private PostResponseDto convertToDto(Post post) {
        PostResponseDto dto = new PostResponseDto();
        dto.setId(post.getId());
        dto.setDescription(post.getDescription());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setVisibility(post.getVisibility());
        // Author info for response
        if (post.getAuthor() != null) {
            PostResponseDto.AuthorDto authorDto = new PostResponseDto.AuthorDto();
            authorDto.setId(post.getAuthor().getId());
            authorDto.setUsername(post.getAuthor().getUsername());
            authorDto.setProfilePhotoUrl(post.getAuthor().getProfilePhotoUrl());
            dto.setAuthor(authorDto);
        }
        if (post.getMedia() != null) {
            dto.setMedia(post.getMedia().stream()
                    .map(media -> {
                        PostResponseDto.MediaResponseDto mediaDto = new PostResponseDto.MediaResponseDto();
                        mediaDto.setId(media.getId());
                        mediaDto.setUrl(media.getUrl());
                        mediaDto.setMediaType(media.getMediaType());
                        return mediaDto;
                    }).collect(Collectors.toList()));
        }
        // Comments and likes will be set in their own services/controllers
        return dto;
    }

    // Implementation of getCurrentUser()
   private UserModel getCurrentUser() {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    if (principal instanceof DefaultOAuth2User) {
        String email = ((DefaultOAuth2User) principal).getAttribute("email");
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
    } else if (principal instanceof UserDetails) {
        String username = ((UserDetails) principal).getUsername();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
    } else {
        // Log the principal type for debugging
        System.err.println("Unexpected principal type: " + principal.getClass().getName());
        throw new IllegalStateException("Authentication principal is not a valid user");
    }
}
}