import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import PostForm from './Post_Form';

const PostManagementUpdate = () => {
  

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