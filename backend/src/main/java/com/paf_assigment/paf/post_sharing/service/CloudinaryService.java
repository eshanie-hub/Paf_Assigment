package com.paf_assigment.paf.post_sharing.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadFile(MultipartFile file, boolean isVideo) throws IOException {
        try {
            String resourceType = isVideo ? "video" : "image";
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("resource_type", resourceType)
            );
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new IOException("Failed to upload file to Cloudinary: " + e.getMessage());
        }
    }

    /**
     * Deletes a file from Cloudinary using its URL.
     *
     * @param url The Cloudinary URL of the file to delete.
     * @return True if the file was successfully deleted, false otherwise.
     */
    public boolean deleteFile(String url) {
        try {
            // Extract public_id from the URL
            String publicId = extractPublicIdFromUrl(url);
            // Determine resource type from URL (image or video)
            boolean isVideo = url.contains("/video/") || url.endsWith(".mp4") || url.endsWith(".mov");
            String resourceType = isVideo ? "video" : "image";

            // Delete the resource from Cloudinary
            Map<?, ?> deleteResult = cloudinary.uploader().destroy(
                publicId,
                ObjectUtils.asMap("resource_type", resourceType)
            );

            // Check the result
            String status = (String) deleteResult.get("result");
            return "ok".equals(status);
        } catch (IllegalArgumentException | IOException e) {
            System.err.println("Failed to delete file from Cloudinary: " + e.getMessage());
            return false;
        }
    }

    /**
     * Extracts the public ID from a Cloudinary URL.
     *
     * @param url The Cloudinary URL.
     * @return The public ID.
     */
    private String extractPublicIdFromUrl(String url) {
        // Remove query parameters if present
        String cleanUrl = url.split("\\?")[0];

        // Split by '/'
        String[] parts = cleanUrl.split("/");

        // Find the 'upload' segment index
        int uploadIndex = -1;
        for (int i = 0; i < parts.length; i++) {
            if (parts[i].equals("upload")) {
                uploadIndex = i;
                break;
            }
        }

        if (uploadIndex == -1 || uploadIndex + 2 >= parts.length) {
            throw new IllegalArgumentException("Invalid Cloudinary URL format");
        }

        // Check if there's a version segment (v1234567)
        int startIndex = uploadIndex + 1;
        if (parts[startIndex].matches("v\\d+")) {
            startIndex++;
        }

        // Build the public ID by joining all remaining segments
        StringBuilder publicId = new StringBuilder();
        for (int i = startIndex; i < parts.length; i++) {
            if (i > startIndex) {
                publicId.append("/");
            }
            publicId.append(parts[i]);
        }

        // Remove file extension if present
        String result = publicId.toString();
        int lastDotIndex = result.lastIndexOf(".");
        if (lastDotIndex != -1) {
            result = result.substring(0, lastDotIndex);
        }

        return result;
    }
}