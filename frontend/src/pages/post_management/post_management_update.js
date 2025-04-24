import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import PostForm from './Post_Form';

const PostManagementUpdate = () => {
  const { id } = useParams();
  const [postText, setPostText] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibility, setVisibility] = useState('public');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const fetchPostData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
      setPostText(response.data.description);
      setExistingMedia(response.data.media || []);
      setVisibility(response.data.visibility || 'public');
    } catch (err) {
      setError({
        message: err.response?.data?.message || 
                err.message || 
                'Failed to fetch post. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  const validateForm = () => {
    const errors = {};
    
    if (!postText.trim()) {
      errors.postText = 'Post content cannot be empty';
    }
    
    const imageCount = mediaFiles.filter(file => file.type.startsWith('image/')).length;
    const existingVideos = existingMedia.filter(m => m.mediaType === 'video');
    const existingImages = existingMedia.filter(m => m.mediaType === 'image');
    
    if (existingVideos.length > 0 && mediaFiles.length > 0) {
      errors.mixedMedia = 'You already have a video. Please remove it first before adding new media.';
    }
    
    if (existingImages.length > 0 && mediaFiles.some(f => f.type.startsWith('video/'))) {
      errors.mixedMedia = 'You cannot mix images and videos. Please remove existing images first.';
    }
    
    if (existingImages.length + imageCount > 3) {
      errors.tooManyImages = `Total images cannot exceed 3`;
    }
    
    mediaFiles.forEach((file, index) => {
      if (file.size > 10 * 1024 * 1024) {
        errors[`fileSize_${index}`] = `${file.name} exceeds the 10MB limit`;
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('description', postText);
      formData.append('visibility', visibility);
      
      // Only keep media IDs that are still in existingMedia
      const keepMediaIds = existingMedia.map(m => m.id);
      formData.append('keepMediaIds', JSON.stringify(keepMediaIds));

      mediaFiles.forEach((file) => {
        formData.append('mediaFiles', file);
      });

      const response = await axios.put(`http://localhost:8080/api/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update state with the response data
      setPostText(response.data.description);
      setExistingMedia(response.data.media || []);
      setVisibility(response.data.visibility || 'public');
      setMediaFiles([]);
      
      setShowSuccessModal(true);
    } catch (err) {
      setError({
        message: err.response?.data?.message || 
                err.message || 
                'Failed to update post. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveExistingMedia = (mediaId) => {
    setExistingMedia(existingMedia.filter(m => m.id !== mediaId));
  };

  const handleRemoveNewMedia = (index) => {
    const newMediaFiles = [...mediaFiles];
    newMediaFiles.splice(index, 1);
    setMediaFiles(newMediaFiles);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error.message}
        </div>
      )}
      <PostForm
        postText={postText}
        setPostText={setPostText}
        mediaFiles={mediaFiles}
        setMediaFiles={setMediaFiles}
        existingMedia={existingMedia}
        setExistingMedia={setExistingMedia}
        validationErrors={validationErrors}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        handleRemoveExistingMedia={handleRemoveExistingMedia}
        handleRemoveNewMedia={handleRemoveNewMedia}
        visibility={visibility}
        setVisibility={setVisibility}
        editingPost={true}
        onCancel={handleCancel}
      />

      <Modal show={showSuccessModal} onHide={() => {
        setShowSuccessModal(false);
        navigate('/');
      }} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title style={{ color: '#2d3436' }}>
            Art Post Updated
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <i className="bi bi-check-circle" style={{ fontSize: '3rem', color: '#00b894' }}></i>
          <p className="mt-3" style={{ color: '#2d3436' }}>
            Your artwork has been updated!
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button 
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/');
            }}
            style={{ 
              backgroundColor: '#F4C3D2',
              borderColor: '#F4C3D2',
              color: '#2d3436',
              fontWeight: '600'
            }}
            className="shadow-sm"
          >
            Continue Browsing
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PostManagementUpdate;