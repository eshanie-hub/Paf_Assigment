package com.paf_assigment.paf.post_sharing.dto;

import javax.validation.constraints.Size;
import java.util.List;

public class PostUpdateDto {
    private String description;
    private String visibility;
    
    @Size(max = 3, message = "Maximum 3 media files allowed")
    private List<MediaUploadDto> newMediaFiles;
    
    private List<Long> mediaToDelete;
    
    // Getters and setters
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getVisibility() {
        return visibility;
    }
    
    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }
    
    public List<MediaUploadDto> getNewMediaFiles() {
        return newMediaFiles;
    }
    
    public void setNewMediaFiles(List<MediaUploadDto> newMediaFiles) {
        this.newMediaFiles = newMediaFiles;
    }
    
    public List<Long> getMediaToDelete() {
        return mediaToDelete;
    }
    
    public void setMediaToDelete(List<Long> mediaToDelete) {
        this.mediaToDelete = mediaToDelete;
    }
}
