import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import PostForm from './Post_Form';

const PostManagementCreate = () => {
  

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