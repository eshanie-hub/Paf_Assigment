package com.paf_assigment.paf.event_management.service;
import com.paf_assigment.paf.event_management.model.Comment;

import java.util.List;
public interface CommentService {
    List<Comment> getCommentsByEventId(Long eventId);
    Comment addComment(Long eventId, Comment comment);
    Comment updateComment(Long commentId, Comment comment, Long currentUserId);
    void deleteComment(Long commentId, Long currentUserId);
}