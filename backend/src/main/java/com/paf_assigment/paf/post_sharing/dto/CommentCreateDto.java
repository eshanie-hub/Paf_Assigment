package com.paf_assigment.paf.post_sharing.dto;

import javax.validation.constraints.NotBlank;

public class CommentCreateDto {
    @NotBlank(message = "Comment content is required")
    private String content;

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
