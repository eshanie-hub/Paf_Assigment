import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import PostForm from './Post_Form';

const PostManagementCreate = () => {
  const [postText, setPostText] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaFilePreviews, setMediaFilePreviews] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [visibility, setVisibility] = useState('public');
  const [videoDuration, setVideoDuration] = useState(0); // Added this line
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    
    if (!postText.trim()) {
      errors.postText = 'Post content cannot be empty';
    }
    
    const hasVideo = mediaFiles.some(file => file.type.startsWith('video/'));
    const imageCount = mediaFiles.filter(file => file.type.startsWith('image/')).length;
    
    if (hasVideo && mediaFiles.length > 1) {
      errors.mediaFiles = 'You can upload either 1 video or up to 3 images, not both';
    } else if (hasVideo && videoDuration > 30) {
      errors.videoDuration = `Video must not exceed 30 seconds (current: ${Math.round(videoDuration)} seconds)`;
    } else if (!hasVideo && imageCount > 3) {
      errors.mediaFiles = `Maximum 3 images allowed`;
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

    try {
      const formData = new FormData();
      formData.append('description', postText);
      formData.append('visibility', visibility);
      
      mediaFiles.forEach((file) => {
        formData.append('mediaFiles', file);
      });
      
      await axios.post('http://localhost:8080/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowSuccessModal(true);
    } catch (err) {
      console.error('Failed to save post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPostText('');
    setMediaFiles([]);
    setMediaFilePreviews([]);
    setValidationErrors({});
  };

  const handleCancel = () => {
    resetForm();
    navigate('/');
  };

  return (
    <>
      <PostForm
        postText={postText}
        setPostText={setPostText}
        mediaFiles={mediaFiles}
        setMediaFiles={setMediaFiles}
        mediaFilePreviews={mediaFilePreviews}
        setMediaFilePreviews={setMediaFilePreviews}
        existingMedia={existingMedia}
        setExistingMedia={setExistingMedia}
        validationErrors={validationErrors}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        setVideoDuration={setVideoDuration}
        handleRemoveExistingMedia={() => {}}
        handleRemoveNewMedia={(index) => {
          const newMediaFiles = [...mediaFiles];
          newMediaFiles.splice(index, 1);
          setMediaFiles(newMediaFiles);
          
          const newPreviews = [...mediaFilePreviews];
          URL.revokeObjectURL(newPreviews[index].preview);
          newPreviews.splice(index, 1);
          setMediaFilePreviews(newPreviews);
        }}
        visibility={visibility}
        setVisibility={setVisibility}
        editingPost={null}
        onCancel={handleCancel}
      />

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => {
        setShowSuccessModal(false);
        navigate('/');
      }} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title style={{ color: '#2d3436' }}>
            Art Post Shared
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <i className="bi bi-check-circle" style={{ fontSize: '3rem', color: '#00b894' }}></i>
          <p className="mt-3" style={{ color: '#2d3436' }}>
            Your artwork has been shared with the community!
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

export default PostManagementCreate;