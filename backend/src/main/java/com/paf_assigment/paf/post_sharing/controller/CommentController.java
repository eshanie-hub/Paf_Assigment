package com.paf_assigment.paf.post_sharing.controller;

import com.paf_assigment.paf.post_sharing.dto.CommentCreateDto;
import com.paf_assigment.paf.post_sharing.dto.CommentResponseDto;
import com.paf_assigment.paf.post_sharing.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    private final CommentService commentService;
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/{postId}")
    public ResponseEntity<CommentResponseDto> addComment(
            @PathVariable Long postId,
            @RequestBody CommentCreateDto dto) {
        return ResponseEntity.ok(commentService.addComment(postId, dto));
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponseDto>> getCommentsByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPost(postId));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.ok().build();
    }
}
