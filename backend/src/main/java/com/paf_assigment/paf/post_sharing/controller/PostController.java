package com.paf_assigment.paf.post_sharing.controller;

import com.paf_assigment.paf.post_sharing.dto.*;
import com.paf_assigment.paf.post_sharing.service.PostService;
import com.paf_assigment.paf.post_sharing.service.VideoProcessingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {
    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    private final PostService postService;
    private final VideoProcessingService videoProcessingService;

    @Value("${app.media.max-count:3}")
    private int maxMediaCount;

    @Value("${app.media.max-video-duration:30}")
    private int maxVideoDurationSeconds;

    public PostController(PostService postService, VideoProcessingService videoProcessingService) {
        this.postService = postService;
        this.videoProcessingService = videoProcessingService;
    }

    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestParam String description,
            @RequestParam(required = false, defaultValue = "public") String visibility,
            @RequestParam(required = false) MultipartFile[] mediaFiles) {

        try {
            if (description == null || description.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Description is required");
            }
            if (!List.of("public", "friends", "private").contains(visibility)) {
                return ResponseEntity.badRequest().body("Invalid visibility value. Must be 'public', 'friends', or 'private'");
            }
            if (mediaFiles != null && mediaFiles.length > 0) {
                if (mediaFiles.length > maxMediaCount) {
                    return ResponseEntity.badRequest()
                            .body("Maximum " + maxMediaCount + " media files allowed. You provided " + mediaFiles.length);
                }
                ResponseEntity<?> mediaValidationResponse = validateMediaFiles(mediaFiles);
                if (mediaValidationResponse != null) return mediaValidationResponse;
            }

            PostCreateDto postDto = new PostCreateDto();
            postDto.setDescription(description);
            postDto.setVisibility(visibility);

            if (mediaFiles != null && mediaFiles.length > 0) {
                List<MultipartFile> validFiles = Arrays.stream(mediaFiles)
                        .filter(file -> !file.isEmpty())
                        .collect(Collectors.toList());
                List<MediaUploadDto> mediaUploadDtos = validFiles.stream()
                        .map(file -> {
                            MediaUploadDto dto = new MediaUploadDto();
                            dto.setFile(file);
                            return dto;
                        })
                        .collect(Collectors.toList());
                postDto.setMediaFiles(mediaUploadDtos);
            }

            PostResponseDto createdPost = postService.createPost(postDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid request for post creation: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            logger.error("Error processing media files: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing media files: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error during post creation: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(
            @PathVariable Long postId,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String visibility,
            @RequestParam(required = false) MultipartFile[] newMediaFiles,
            @RequestParam(required = false) Long[] mediaToDelete) {

        try {
            if (description != null && description.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Description cannot be empty");
            }
            if (visibility != null && !List.of("public", "friends", "private").contains(visibility)) {
                return ResponseEntity.badRequest().body("Invalid visibility value. Must be 'public', 'friends', or 'private'");
            }
            PostResponseDto currentPost = postService.getPostById(postId);

            ResponseEntity<?> mediaValidationResponse = validateMediaUpdate(
                    currentPost, mediaToDelete, newMediaFiles);
            if (mediaValidationResponse != null) return mediaValidationResponse;

            PostUpdateDto updateDto = new PostUpdateDto();
            if (description != null) updateDto.setDescription(description);
            if (visibility != null) updateDto.setVisibility(visibility);

            if (newMediaFiles != null && newMediaFiles.length > 0) {
                List<MultipartFile> validFiles = Arrays.stream(newMediaFiles)
                        .filter(file -> !file.isEmpty())
                        .collect(Collectors.toList());
                List<MediaUploadDto> mediaUploadDtos = validFiles.stream()
                        .map(file -> {
                            MediaUploadDto dto = new MediaUploadDto();
                            dto.setFile(file);
                            return dto;
                        })
                        .collect(Collectors.toList());
                updateDto.setNewMediaFiles(mediaUploadDtos);
            }
            if (mediaToDelete != null && mediaToDelete.length > 0) {
                updateDto.setMediaToDelete(Arrays.asList(mediaToDelete));
            }
            PostResponseDto updatedPost = postService.updatePost(postId, updateDto);
            return ResponseEntity.ok(updatedPost);
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid request for post update: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            logger.error("Error processing media files: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing media files: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error during post update: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        try {
            postService.deletePost(postId);
            return ResponseEntity.ok().body("Post deleted successfully");
        } catch (IllegalArgumentException e) {
            logger.warn("Post not found for deletion: id={}", postId);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Failed to delete post: id={}, error={}", postId, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Failed to delete post: " + e.getMessage());
        }
    }

    @PatchMapping("/{postId}/visibility")
    public ResponseEntity<?> updateVisibility(
            @PathVariable Long postId,
            @RequestParam String visibility) {
        try {
            if (!List.of("public", "friends", "private").contains(visibility)) {
                return ResponseEntity.badRequest().body("Invalid visibility value. Must be 'public', 'friends', or 'private'");
            }
            PostResponseDto updatedPost = postService.updateVisibility(postId, visibility);
            return ResponseEntity.ok(updatedPost);
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid visibility update request: postId={}, visibility={}", postId, visibility);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Failed to update visibility: postId={}, visibility={}, error={}",
                    postId, visibility, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Failed to update visibility: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        try {
            return ResponseEntity.ok(postService.getAllPosts());
        } catch (Exception e) {
            logger.error("Error retrieving all posts: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Error retrieving posts: " + e.getMessage());
        }
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable Long postId) {
        try {
            return ResponseEntity.ok(postService.getPostById(postId));
        } catch (IllegalArgumentException e) {
            logger.warn("Post not found: id={}", postId);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error retrieving post: id={}, error={}", postId, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Error retrieving post: " + e.getMessage());
        }
    }

    // --- Helper methods for media validation (as in your file) ---
    private ResponseEntity<?> validateMediaFiles(MultipartFile[] mediaFiles) throws IOException {
        int videoCount = 0;
        int imageCount = 0;
        for (MultipartFile file : mediaFiles) {
            if (file.isEmpty()) continue;
            String contentType = file.getContentType();
            if (contentType != null && contentType.startsWith("video/")) {
                videoCount++;
                int duration = videoProcessingService.getVideoDuration(file);
                if (duration > maxVideoDurationSeconds) {
                    return ResponseEntity.badRequest()
                            .body("Video exceeds maximum duration of " + maxVideoDurationSeconds + " seconds");
                }
            } else if (contentType != null && contentType.startsWith("image/")) {
                imageCount++;
            } else {
                return ResponseEntity.badRequest()
                        .body("Unsupported file type: " + contentType);
            }
        }
        if (videoCount > 0 && imageCount > 0) {
            return ResponseEntity.badRequest()
                    .body("Cannot mix videos and images. Either upload 1 video OR up to 3 images.");
        }
        if (videoCount > 1) {
            return ResponseEntity.badRequest()
                    .body("Only 1 video file is allowed per post.");
        }
        return null;
    }

    private ResponseEntity<?> validateMediaUpdate(
            PostResponseDto currentPost,
            Long[] mediaToDelete,
            MultipartFile[] newMediaFiles) throws IOException {
        int currentImageCount = 0;
        int currentVideoCount = 0;
        if (currentPost.getMedia() != null) {
            for (PostResponseDto.MediaResponseDto media : currentPost.getMedia()) {
                if ("video".equals(media.getMediaType())) currentVideoCount++;
                else if ("image".equals(media.getMediaType())) currentImageCount++;
            }
        }
        int imagesToDelete = 0;
        int videosToDelete = 0;
        if (mediaToDelete != null && mediaToDelete.length > 0) {
            for (Long mediaId : mediaToDelete) {
                for (PostResponseDto.MediaResponseDto media : currentPost.getMedia()) {
                    if (media.getId().equals(mediaId)) {
                        if ("video".equals(media.getMediaType())) videosToDelete++;
                        else if ("image".equals(media.getMediaType())) imagesToDelete++;
                        break;
                    }
                }
            }
        }
        int newImageCount = 0;
        int newVideoCount = 0;
        if (newMediaFiles != null && newMediaFiles.length > 0) {
            for (MultipartFile file : newMediaFiles) {
                if (file.isEmpty()) continue;
                String contentType = file.getContentType();
                if (contentType != null && contentType.startsWith("video/")) {
                    newVideoCount++;
                    int duration = videoProcessingService.getVideoDuration(file);
                    if (duration > maxVideoDurationSeconds) {
                        return ResponseEntity.badRequest()
                                .body("Video exceeds maximum duration of " + maxVideoDurationSeconds + " seconds");
                    }
                } else if (contentType != null && contentType.startsWith("image/")) {
                    newImageCount++;
                } else {
                    return ResponseEntity.badRequest()
                            .body("Unsupported file type: " + contentType);
                }
            }
        }
        int finalImageCount = currentImageCount - imagesToDelete + newImageCount;
        int finalVideoCount = currentVideoCount - videosToDelete + newVideoCount;
        if (finalVideoCount > 0 && finalImageCount > 0) {
            return ResponseEntity.badRequest()
                    .body("Cannot mix videos and images. Either have 1 video OR up to 3 images.");
        }
        if (finalVideoCount > 1) {
            return ResponseEntity.badRequest()
                    .body("Only 1 video file is allowed per post.");
        }
        if (finalImageCount > maxMediaCount) {
            return ResponseEntity.badRequest()
                    .body("Maximum " + maxMediaCount + " images allowed. You would have " + finalImageCount);
        }
        return null;
    }
}
