package com.paf_assigment.paf.post_sharing.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;


import ws.schild.jave.EncoderException;
import ws.schild.jave.MultimediaObject;

@Service
public class VideoProcessingService {

    /**
     * Gets the duration of a video file in seconds
     * 
     * @param videoFile The MultipartFile containing the video
     * @return Duration in seconds
     * @throws IOException If there's an error reading the file
     */
    public int getVideoDuration(MultipartFile videoFile) throws IOException {
        File tempFile = null;
        try {
            // Create a temporary file
            tempFile = File.createTempFile("video_", null);
            try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                fos.write(videoFile.getBytes());
            }
            
            // Use JAVE to get the video duration
            MultimediaObject multimediaObject = new MultimediaObject(tempFile);
            return (int) (multimediaObject.getInfo().getDuration() / 1000);
        } catch (EncoderException e) {
            throw new IOException("Failed to process video file", e);
        } finally {
            // Clean up the temporary file
            if (tempFile != null && tempFile.exists()) {
                tempFile.delete();
            }
        }
    }
}