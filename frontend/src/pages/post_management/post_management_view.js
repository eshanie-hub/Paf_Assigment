import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Button, 
  Card, 
  Dropdown, 
  Badge, 
  Spinner, 
  Alert, 
  Image, 
  Row, 
  Col 
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostManagementView = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Custom colors
  const postBgColor = '#E7ECF8'; 
  const buttonColor = '#F4C3D2'; 
  const primaryColor = '#2d3436';
  const textColor = '#2d3436';
  const outerBgColor = '#FFF5F7'; // Match Navbar background color
  
  // Constants for media display
  const IMAGE_HEIGHT = 240;

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8080/api/posts');
      setPosts(response.data);
    } catch (err) {
      setError({
        message: err.response?.data?.message || 
                err.message || 
                'Failed to fetch posts. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:8080/api/posts/${postId}/like`);
      fetchPosts();
    } catch (err) {
      setError({
        message: 'Failed to like post.'
      });
    }
  };

  const handleEdit = (postId) => {
    navigate(`/pages/post_management/Post_management_update/${postId}`);
  };

  const handleDelete = (postId) => {
    navigate(`/pages/post_management/Post_management_delete/${postId}`);
  };

  const handleVisibility = (postId, currentVisibility) => {
    navigate(`/pages/post_management/Post_Form/${postId}`, { 
      state: { visibility: currentVisibility } 
    });
  };

  return (
    <div 
      style={{
        height: '100vh', // Full viewport height
        overflowY: 'auto', // Enable vertical scrolling
        padding: '1rem', // Add padding for better spacing
        backgroundColor: outerBgColor, // Match Navbar background color
        scrollbarWidth: 'thin', // For Firefox
        scrollbarColor: 'white transparent', // For Firefox
      }}
    >
      {/* Custom scrollbar styles */}
      <style>
        {`
          /* For Chrome, Edge, and Safari */
          div::-webkit-scrollbar {
            width: 8px;
          }
          div::-webkit-scrollbar-thumb {
            background-color: white; /* White scrollbar thumb */
            border-radius: 4px;
          }
          div::-webkit-scrollbar-track {
            background: transparent; /* Transparent track */
          }
        `}
      </style>

      <Container className="my-5" style={{ maxWidth: '800px' }}>
        {/* Error Alert */}
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible className="rounded shadow-sm">
            <strong>Error:</strong> {error.message}
          </Alert>
        )}

        {/* Create Post Button */}
        <div className="d-flex justify-content-center mb-4">
          <Button
            style={{ 
              backgroundColor: buttonColor,
              borderColor: buttonColor,
              color: textColor,
              fontWeight: '600'
            }}
            className="px-4 py-2 shadow-sm"
            onClick={() => navigate('/pages/post_management/Post_management_create')}
          >
            <i className="bi bi-pencil-square me-2"></i> Create Art Post
          </Button>
        </div>

        {/* Posts List */}
        {isLoading && posts.length === 0 ? (
          <div className="text-center my-5">
            <Spinner animation="border" style={{ color: primaryColor }} />
            <p className="mt-2" style={{ color: textColor }}>Loading art posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center my-5">
            <i className="bi bi-palette" style={{ fontSize: '3rem', color: primaryColor }}></i>
            <h5 className="mt-3" style={{ color: textColor }}>No art posts yet</h5>
            <p style={{ color: '#636e72' }}>Share your first artwork to inspire others!</p>
          </div>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="mb-4 shadow-sm border-0" style={{ backgroundColor: postBgColor }}>
              <Card.Header className="border-0 d-flex justify-content-between align-items-center">
                <div>
                  {post.visibility === 'private' && (
                    <Badge className="me-2" style={{ backgroundColor: '#636e72' }}>
                      <i className="bi bi-lock-fill me-1"></i> Private
                    </Badge>
                  )}
                  {post.visibility === 'friends' && (
                    <Badge className="me-2" style={{ backgroundColor: primaryColor }}>
                      <i className="bi bi-people-fill me-1"></i> Community
                    </Badge>
                  )}
                  <small className="text-muted">
                    Posted on {new Date(post.createdAt).toLocaleString()}
                  </small>
                </div>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="light" size="sm" id={`dropdown-${post.id}`} className="border-0 shadow-sm">
                    <i className="bi bi-three-dots-vertical"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEdit(post.id)}>
                      <i className="bi bi-pencil me-2"></i> Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleVisibility(post.id, post.visibility)}>
                      <i className="bi bi-eye me-2"></i> Visibility
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item 
                      className="text-danger"
                      onClick={() => handleDelete(post.id)}
                    >
                      <i className="bi bi-trash me-2"></i> Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Card.Header>

              <Card.Body>
                <Card.Text 
                  style={{ 
                    color: textColor, 
                    fontSize: '1.3rem', // Increased font size
                    fontWeight: 'bold' // Made text bold
                  }}
                >
                  {post.description}
                </Card.Text>

                {post.media?.length > 0 && (
                  <Row className="mt-3">
                    {post.media.map((media, index) => (
                      <Col key={index} xs={12} sm={post.media.length > 1 ? 6 : 12} md={post.media.length > 1 ? 4 : 6} className="mb-3">
                        <div className="shadow-sm rounded overflow-hidden" style={{ height: `${IMAGE_HEIGHT}px` }}>
                          {media.mediaType === 'image' ? (
                            <Image 
                              src={media.url} 
                              style={{ 
                                height: '100%', 
                                width: '100%', 
                                objectFit: 'cover' 
                              }} 
                              className="rounded" 
                            />
                          ) : (
                            <video 
                              controls 
                              className="w-100 h-100 rounded"
                              style={{ objectFit: 'cover' }}
                            >
                              <source src={media.url} type="video/mp4" />
                            </video>
                          )}
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
                
                <div className="mt-3 border-top pt-2">
                  <div className="d-flex">
                    <Button 
                      variant={post.liked ? "outline-danger" : "outline-secondary"}
                      size="sm" 
                      className="me-2 shadow-sm"
                      onClick={() => handleLike(post.id)}
                      style={{
                        borderColor: post.liked ? '#ff7675' : '#dfe6e9',
                        color: post.liked ? '#ff7675' : textColor
                      }}
                    >
                      <i className={`bi ${post.liked ? 'bi-heart-fill' : 'bi-heart'} me-1`}></i>
                      {post.likes || 0}
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="shadow-sm"
                      style={{
                        borderColor: '#dfe6e9',
                        color: textColor
                      }}
                    >
                      <i className="bi bi-chat me-1"></i>
                      {post.comments?.length || 0}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </Container>
    </div>
  );
};

export default PostManagementView;