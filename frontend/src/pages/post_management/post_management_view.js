import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Button,
  Card,
  Image,
  Row,
  Col,
  Dropdown,
  Badge,
  Alert,
  Spinner
} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const PostManagementView = () => {
  

  return (
    <Container className="my-5" style={{ maxWidth: '800px' }}>
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <Alert variant="warning" onClose={() => setShowDeleteConfirm(false)} dismissible>
          <Alert.Heading>Delete Confirmation</Alert.Heading>
          <p>Are you sure you want to delete this post?</p>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => handleDelete(currentPostId)}>Delete</Button>
          </div>
        </Alert>
      )}
      {/* Error Alert */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible className="rounded shadow-sm">
          <strong>Error:</strong> {error.message}
        </Alert>
      )}

      {/* Create Post Button */}
      <div className="d-flex justify-content-end mb-4">
        <Button
          style={{ 
            backgroundColor: '#F4C3D2',
            borderColor: '#F4C3D2',
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
          <Card key={post.id} className="mb-4 shadow-sm border-0" style={{ backgroundColor: '#E7ECF8' }}>
            <Card.Header className="border-0 d-flex justify-content-between align-items-center" style={{ backgroundColor: 'transparent' }}>
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
                  <Dropdown.Item onClick={() => navigate(`/pages/post_management/Post_management_update/${post.id}`)}>
                    <i className="bi bi-pencil me-2"></i> Edit
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate(`/pages/post_management/Post_Form/${post.id}`)}>
                    <i className="bi bi-eye me-2"></i> Visibility
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item 
                    className="text-danger"
                    onClick={() => {
                      setCurrentPostId(post.id);
                      setShowDeleteConfirm(true);
                    }}
                  >
                    <i className="bi bi-trash me-2"></i> Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>

            <Card.Body>
              <Card.Text style={{ color: textColor, fontSize: '1.1rem' }}>{post.description}</Card.Text>

              {post.media?.length > 0 && (
                <Row className="mt-3 media-container">
                  {post.media.map((media, index) => (
                    <Col key={index} xs={12} sm={6} md={4} className="mb-3">
                      <div className="media-wrapper shadow-sm rounded overflow-hidden" style={{ height: `${IMAGE_HEIGHT}px` }}>
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
                            Your browser does not support the video tag.
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
  );
};

export default PostManagementView;