import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Spinner } from 'react-bootstrap';

const PostManagementDelete = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:8080/api/posts/${id}`);
      navigate('/');
    } catch (err) {
      setError({
        message: err.response?.data?.message || 
                err.message || 
                'Failed to delete post. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={true} onHide={() => navigate('/')} centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title style={{ color: '#2d3436' }}>Delete Art Post</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <i className="bi bi-exclamation-triangle" style={{ fontSize: '3rem', color: '#fdcb6e' }}></i>
        <p className="mt-3" style={{ color: '#2d3436' }}>
          Are you sure you want to delete this artwork? This action cannot be undone.
        </p>
        {error && (
          <p className="text-danger mt-2">
            {error.message}
          </p>
        )}
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button
          variant="light"
          onClick={() => navigate('/')}
          className="shadow-sm"
          style={{
            color: '#2d3436',
            border: '1px solid #ced4da'
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleDelete}
          disabled={isLoading}
          variant="danger"
          className="shadow-sm"
        >
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" /> Deleting...
            </>
          ) : (
            'Delete Artwork'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PostManagementDelete;