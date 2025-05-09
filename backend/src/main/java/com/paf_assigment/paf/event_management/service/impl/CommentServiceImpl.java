package com.paf_assigment.paf.event_management.service.impl;

import com.paf_assigment.paf.event_management.exception.ResourceNotFoundException;
import com.paf_assigment.paf.event_management.model.Comment;
import com.paf_assigment.paf.event_management.model.Event;
import com.paf_assigment.paf.event_management.repository.CommentRepository;
import com.paf_assigment.paf.event_management.repository.EventRepository;
import com.paf_assigment.paf.event_management.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private EventRepository eventRepository;

    @Override
    public List<Comment> getCommentsByEventId(Long eventId) {
        return commentRepository.findByEventId(eventId);
    }

    @Override
    public Comment addComment(Long eventId, Comment comment) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));
    
        Comment newComment = new Comment();
        newComment.setContent(comment.getContent());
        newComment.setUserId(comment.getUserId());
        newComment.setUsername(comment.getUsername());  // <-- Set explicitly
        newComment.setEvent(event);
    
        return commentRepository.save(newComment);
    }
    


    @Override
    public Comment updateComment(Long commentId, Comment updatedComment, Long currentUserId) {
        Comment existingComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with ID: " + commentId));

        if (!existingComment.getUserId().equals(currentUserId)) {
            throw new SecurityException("You are not authorized to update this comment.");
        }

        existingComment.setContent(updatedComment.getContent());
        return commentRepository.save(existingComment);
    }

    @Override
    public void deleteComment(Long commentId, Long currentUserId) {
        Comment existingComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with ID: " + commentId));

        if (!existingComment.getUserId().equals(currentUserId)) {
            throw new SecurityException("You are not authorized to delete this comment.");
        }

        commentRepository.delete(existingComment);
    }
}
