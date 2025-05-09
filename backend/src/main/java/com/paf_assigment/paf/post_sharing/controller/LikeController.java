package com.paf_assigment.paf.post_sharing.controller;

import com.paf_assigment.paf.post_sharing.dto.LikeResponseDto;
import com.paf_assigment.paf.post_sharing.service.LikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;

@RestController
@RequestMapping("/api/likes")
@CrossOrigin(origins = "http://localhost:3000")

public class LikeController {
   
    private final LikeService likeService;
    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping("/{postId}")
    public ResponseEntity<?> likePost(@PathVariable Long postId) {
        likeService.likePost(postId);
        return ResponseEntity.ok().body("Post liked successfully");
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> unlikePost(@PathVariable Long postId) {
        likeService.unlikePost(postId);
        return ResponseEntity.ok().body("Post unliked successfully");
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<LikeResponseDto>> getLikesByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(likeService.getLikesByPost(postId));
    }
}
