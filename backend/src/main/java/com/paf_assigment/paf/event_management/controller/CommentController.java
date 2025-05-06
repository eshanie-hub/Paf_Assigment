package com.paf_assigment.paf.event_management.controller;

import com.paf_assigment.paf.event_management.model.Comment;
import com.paf_assigment.paf.event_management.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Get comments for a specific event
    @GetMapping("/events/{eventId}/comments")
    public List<Comment> getComments(@PathVariable Long eventId) {
        return commentService.getCommentsByEventId(eventId);
    }

    // Post a new comment for an event
    @PostMapping("/events/{eventId}/comments")
    public Comment addComment(
            @PathVariable Long eventId,
            @RequestBody Comment comment
    ) {
        return commentService.addComment(eventId, comment);
    }

    // Update own comment (requires userId header for verification)
    @PutMapping("/comments/{commentId}")
    public Comment updateComment(
            @PathVariable Long commentId,
            @RequestBody Comment updatedComment,
            @RequestHeader("userId") Long currentUserId
    ) {
        return commentService.updateComment(commentId, updatedComment, currentUserId);
    }

    // Delete own comment (requires userId header for verification)
    @DeleteMapping("/comments/{commentId}")
    public void deleteComment(
            @PathVariable Long commentId,
            @RequestHeader("userId") Long currentUserId
    ) {
        commentService.deleteComment(commentId, currentUserId);
    }
}
