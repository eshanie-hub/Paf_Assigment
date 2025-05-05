import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Custom colors
const postBgColor = '#E7ECF8'; 
const primaryColor = '#2d3436';
const textColor = '#2d3436';

function PostManagementDelete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        setError({
          message: err.response?.data?.message || 
                 err.message || 
                 'Failed to fetch post. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);
  
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
  
  if (isLoading && !post) {
    return (
      <Container className="my-5 text-center" style={{ maxWidth: '800px' }}>
        <Spinner animation="border" style={{ color: primaryColor }} />
        <p className="mt-2" style={{ color: textColor }}>Loading post details...</p>
      </Container>
    );
  }
  
  return (
    <Container className="my-5" style={{ maxWidth: '800px' }}>
      <h4 className="mb-4">Delete Art Post</h4>
      
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible className="rounded shadow-sm">
          <strong>Error:</strong> {error.message}
        </Alert>
      )}
      
      {post && (
        <Card className="mb-4 shadow-sm border-0" style={{ backgroundColor: postBgColor }}>
          <Card.Header className="border-0">
            <h5 className="m-0" style={{ color: primaryColor, fontWeight: '600' }}>
              <i className="bi bi-trash me-2"></i>
              Confirm Deletion
            </h5>
          </Card.Header>
          <Card.Body>
            <p style={{ color: textColor }}>
              Are you sure you want to delete this artwork post? This action cannot be undone.
            </p>
            
            {post.media && post.media.length > 0 && (
              <div className="alert alert-warning">
                <i className="bi bi-exclamation-triangle me-2"></i>
                This post contains {post.media.length} media {post.media.length === 1 ? 'file' : 'files'} that will also be deleted.
              </div>
            )}
            
            <Card className="mb-3">
              <Card.Body>
                <p className="text-muted mb-1">Post Description:</p>
                <p>{post.description}</p>
              </Card.Body>
            </Card>
            
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="light"
                onClick={() => navigate('/')}
                className="shadow-sm"
                style={{
                  color: textColor,
                  border: '1px solid #ced4da'
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                className="shadow-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Deleting...
                  </>
                ) : (
                  'Delete Permanently'
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default PostManagementDelete;