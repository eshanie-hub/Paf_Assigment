package com.paf_assigment.paf.post_sharing.dto;

import org.springframework.web.multipart.MultipartFile;

public class MediaUploadDto {
    private MultipartFile file;

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }
}
