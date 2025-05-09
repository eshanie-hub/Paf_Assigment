package com.paf_assigment.paf.post_sharing.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;

public class PostCreateDto {
    @NotBlank(message = "Description is required")
    private String description;

    private String visibility;

    @Size(max = 3, message = "Maximum 3 media files allowed")
    private List<MediaUploadDto> mediaFiles;

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }

    public List<MediaUploadDto> getMediaFiles() { return mediaFiles; }
    public void setMediaFiles(List<MediaUploadDto> mediaFiles) { this.mediaFiles = mediaFiles; }
}
