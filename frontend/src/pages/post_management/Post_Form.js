import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Form,
  Button,
  Card,
  Spinner,
  Alert,
  Image,
  Row,
  Col,
  ProgressBar
} from 'react-bootstrap';

// Constants for media display
const IMAGE_HEIGHT = 240;
const MAX_IMAGES = 3;
const MAX_VIDEO_DURATION = 30;

// Custom colors
const postBgColor = '#E7ECF8'; 
const buttonColor = '#F4C3D2'; 
const primaryColor = '#2d3436';
const textColor = '#2d3436';

function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postText, setPostText] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaFilePreviews, setMediaFilePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [visibility, setVisibility] = useState('public');
  const [validationErrors, setValidationErrors] = useState({});
  const [existingMedia, setExistingMedia] = useState([]);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    // If id is provided, fetch the post data for editing
    if (id) {
      const fetchPostData = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
          const post = response.data;
          setPostText(post.description);
          setEditingPost(post);
          setVisibility(post.visibility || 'public');
          setExistingMedia(post.media || []);
        } catch (err) {
          setError({
            message: err.response?.data?.message || 
                    err.message || 
                    'Failed to fetch post data. Please try again.'
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchPostData();
    }
  }, [id]);

  // Generate previews for newly selected files
  useEffect(() => {
    const previews = [];
    
    const processFiles = async () => {
      for (const file of mediaFiles) {
        const preview = URL.createObjectURL(file);
        const isImage = file.type.startsWith('image/');
        
        if (!isImage) {
          // For video, we need to check duration
          const video = document.createElement('video');
          video.preload = 'metadata';
          
          await new Promise(resolve => {
            video.onloadedmetadata = () => {
              setVideoDuration(video.duration);
              resolve();
            };
            video.src = preview;
          });
        }
        
        previews.push({
          file,
          preview,
          type: isImage ? 'image' : 'video'
        });
      }
      
      setMediaFilePreviews(previews);
    };
    
    processFiles();
    
    return () => {
      previews.forEach(p => URL.revokeObjectURL(p.preview));
    };
  }, [mediaFiles]);

  const validateForm = () => {
    const errors = {};
    
    if (!postText.trim()) {
      errors.postText = 'Post content cannot be empty';
    }
    
    const hasVideo = mediaFiles.some(file => file.type.startsWith('video/'));
    const imageCount = mediaFiles.filter(file => file.type.startsWith('image/')).length;
    
    if (hasVideo && mediaFiles.length > 1) {
      errors.mediaFiles = 'You can upload either 1 video or up to 3 images, not both';
    } else if (hasVideo && videoDuration > MAX_VIDEO_DURATION) {
      errors.videoDuration = `Video must not exceed ${MAX_VIDEO_DURATION} seconds`;
    } else if (!hasVideo && imageCount > MAX_IMAGES) {
      errors.mediaFiles = `Maximum ${MAX_IMAGES} images allowed`;
    }
    
    mediaFiles.forEach((file, index) => {
      if (file.size > 10 * 1024 * 1024) {
        errors[`fileSize_${index}`] = `${file.name} exceeds the 10MB limit`;
      }
    });
    
    if (editingPost) {
      const existingVideos = existingMedia.filter(m => m.mediaType === 'video');
      const existingImages = existingMedia.filter(m => m.mediaType === 'image');
      
      if (existingVideos.length > 0 && mediaFiles.length > 0) {
        errors.mixedMedia = 'You already have a video. Remove it first before adding new media.';
      }
      
      if (existingImages.length > 0 && mediaFiles.some(f => f.type.startsWith('video/'))) {
        errors.mixedMedia = 'You cannot mix images and videos. Remove existing images first.';
      }
      
      if (existingImages.length + imageCount > MAX_IMAGES) {
        errors.tooManyImages = `Total images cannot exceed ${MAX_IMAGES}`;
      }
    }
    
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
      
      // If editing, we need to determine which media files to delete
      if (editingPost) {
        // Find media IDs that were in the original post but are no longer in existingMedia
        const originalMediaIds = editingPost.media.map(media => media.id);
        const currentMediaIds = existingMedia.map(media => media.id);
        const mediaToDelete = originalMediaIds.filter(id => !currentMediaIds.includes(id));
        
        // Add each ID to delete separately
        mediaToDelete.forEach(id => {
          formData.append('mediaToDelete', id);
        });
      }
      
      // Append each new file with the correct parameter name
      mediaFiles.forEach((file) => {
        if (editingPost) {
          formData.append('newMediaFiles', file);
        } else {
          formData.append('mediaFiles', file);
        }
      });
      
      if (editingPost) {
        await axios.put(`http://localhost:8080/api/posts/${editingPost.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('http://localhost:8080/api/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      resetForm();
      navigate('/');
    } catch (err) {
      setError({
        message: err.response?.data?.message || 
                err.message || 
                'Failed to save post. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPostText('');
    setMediaFiles([]);
    setMediaFilePreviews([]);
    setEditingPost(null);
    setExistingMedia([]);
    setValidationErrors({});
    setVideoDuration(0);
  };

  const handleRemoveExistingMedia = (mediaId) => {
    setExistingMedia(existingMedia.filter(m => m.id !== mediaId));
  };

  const handleRemoveNewMedia = (index) => {
    const newMediaFiles = [...mediaFiles];
    newMediaFiles.splice(index, 1);
    setMediaFiles(newMediaFiles);
    
    const newPreviews = [...mediaFilePreviews];
    URL.revokeObjectURL(newPreviews[index].preview);
    newPreviews.splice(index, 1);
    setMediaFilePreviews(newPreviews);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    const hasVideo = files.some(file => file.type.startsWith('video/'));
    const existingImageCount = editingPost ? 
      existingMedia.filter(m => m.mediaType === 'image').length : 0;
    const hasExistingVideo = editingPost && 
      existingMedia.some(m => m.mediaType === 'video');
    
    if (hasVideo && files.length > 1) {
      setError({
        message: 'You can only upload 1 video at a time, or up to 3 images'
      });
      return;
    }
    
    if (hasExistingVideo && files.length > 0) {
      setError({
        message: 'You already have a video. Remove it first before adding new media.'
      });
      return;
    }
    
    if (hasVideo && existingImageCount > 0) {
      setError({
        message: 'You cannot mix images and videos. Remove existing images first.'
      });
      return;
    }
    
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length + existingImageCount > MAX_IMAGES) {
      setError({
        message: `Total images cannot exceed ${MAX_IMAGES}`
      });
      return;
    }
    
    setMediaFiles(files);
  };

  return (
    <Card className="mb-4 shadow-sm border-0" style={{ backgroundColor: postBgColor }}>
      <Card.Header className="border-0">
        <h5 className="m-0" style={{ color: primaryColor, fontWeight: '600' }}>
          <i className="bi bi-palette me-2"></i>
          {editingPost ? 'Edit Art Post' : 'Share Your Artwork'}
        </h5>
      </Card.Header>
      <Card.Body>
        {/* Error Alert */}
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible className="rounded shadow-sm">
            <strong>Error:</strong> {error.message}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={4}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Describe your artwork..."
              isInvalid={!!validationErrors.postText}
              required
              style={{ 
                border: '1px solid #ced4da',
                borderRadius: '8px',
                backgroundColor: '#fff'
              }}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.postText}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <label htmlFor="media-upload" 
                className="btn me-2 shadow-sm" 
                style={{ 
                  backgroundColor: buttonColor,
                  borderColor: buttonColor,
                  color: textColor,
                  fontWeight: '500'
                }}>
                <i className="bi bi-image me-1"></i> 
                {editingPost ? 'Add Media' : 'Upload Artwork'}
              </label>
              <small className="text-muted" style={{ color: '#636e72' }}>
                Max 3 images or 1 video (30 sec max)
                {editingPost && existingMedia.length > 0 && (
                  <span> - Currently using: {existingMedia.length} {existingMedia.length === 1 ? 'file' : 'files'}</span>
                )}
              </small>
            </div>
            
            <Form.Control
              id="media-upload"
              type="file"
              className="d-none"
              onChange={handleFileSelect}
              accept="image/*,video/*"
              multiple
            />
            
            {Object.keys(validationErrors).some(key => 
              key.startsWith('fileSize') || 
              key === 'mediaFiles' || 
              key === 'videoDuration' ||
              key === 'mixedMedia' ||
              key === 'tooManyImages'
            ) && (
              <Alert variant="danger" className="mt-2 rounded shadow-sm">
                <ul className="mb-0 ps-3">
                  {Object.entries(validationErrors)
                    .filter(([key]) => 
                      key.startsWith('fileSize') || 
                      key === 'mediaFiles' || 
                      key === 'videoDuration' ||
                      key === 'mixedMedia' ||
                      key === 'tooManyImages'
                    )
                    .map(([key, value]) => (
                      <li key={key}>{value}</li>
                    ))
                  }
                </ul>
              </Alert>
            )}
          </Form.Group>

          {/* Existing Media Preview (when editing) */}
          {editingPost && existingMedia.length > 0 && (
            <div className="mb-3">
              <h6 style={{ color: primaryColor }}>Current Artwork</h6>
              <Row>
                {existingMedia.map((media) => (
                  <Col key={media.id} xs={12} sm={6} md={4} className="mb-3">
                    <div className="position-relative shadow-sm rounded overflow-hidden">
                      {media.mediaType === 'image' ? (
                        <Image 
                          src={media.url} 
                          style={{ 
                            height: `${IMAGE_HEIGHT}px`, 
                            width: '100%',
                            objectFit: 'cover'
                          }} 
                          thumbnail 
                        />
                      ) : (
                        <video 
                          style={{ 
                            height: `${IMAGE_HEIGHT}px`, 
                            width: '100%',
                            objectFit: 'cover'
                          }}
                          controls
                        >
                          <source src={media.url} type="video/mp4" />
                        </video>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0 m-1 rounded-circle"
                        style={{ width: '28px', height: '28px', padding: '0' }}
                        onClick={() => handleRemoveExistingMedia(media.id)}
                      >
                        <i className="bi bi-x-lg"></i>
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* New Media Preview */}
          {mediaFilePreviews.length > 0 && (
            <div className="mb-3">
              <h6 style={{ color: primaryColor }}>{editingPost ? 'New Artwork' : 'Artwork Preview'}</h6>
              <Row>
                {mediaFilePreviews.map((item, index) => (
                  <Col key={index} xs={12} sm={6} md={4} className="mb-3">
                    <div className="position-relative shadow-sm rounded overflow-hidden">
                      {item.type === 'image' ? (
                        <Image 
                          src={item.preview} 
                          style={{ 
                            height: `${IMAGE_HEIGHT}px`, 
                            width: '100%',
                            objectFit: 'cover'
                          }} 
                          thumbnail 
                        />
                      ) : (
                        <div className="position-relative">
                          <video 
                            ref={videoRef}
                            style={{ 
                              height: `${IMAGE_HEIGHT}px`, 
                              width: '100%',
                              objectFit: 'cover'
                            }}
                            controls
                          >
                            <source src={item.preview} type={item.file.type} />
                          </video>
                          {videoDuration > 0 && (
                            <div className="mt-1">
                              <small className="text-muted">
                                Duration: {Math.round(videoDuration)} seconds 
                                {videoDuration > MAX_VIDEO_DURATION && 
                                  <span className="text-danger"> (exceeds limit)</span>
                                }
                              </small>
                              <ProgressBar 
                                variant={videoDuration > MAX_VIDEO_DURATION ? "danger" : "success"}
                                now={Math.min(100, (videoDuration / MAX_VIDEO_DURATION) * 100)} 
                              />
                            </div>
                          )}
                        </div>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0 m-1 rounded-circle"
                        style={{ width: '28px', height: '28px', padding: '0' }}
                        onClick={() => handleRemoveNewMedia(index)}
                      >
                        <i className="bi bi-x-lg"></i>
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* Visibility selector */}
          <Form.Group className="mb-3">
            <Form.Label style={{ color: primaryColor, fontWeight: '500' }}>Visibility</Form.Label>
            <Form.Select 
              value={visibility} 
              onChange={(e) => setVisibility(e.target.value)}
              style={{ 
                border: '1px solid #ced4da',
                borderRadius: '8px'
              }}
            >
              <option value="public">Everyone</option>
              <option value="friends">Art Community Only</option>
              <option value="private">Only me</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="light"
              onClick={() => {
                navigate('/');
                resetForm();
              }}
              className="shadow-sm"
              style={{
                color: textColor,
                border: '1px solid #ced4da'
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              style={{ 
                backgroundColor: buttonColor,
                borderColor: buttonColor,
                color: textColor,
                fontWeight: '600'
              }}
              className="shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" /> {editingPost ? 'Updating...' : 'Sharing...'}
                </>
              ) : (
                editingPost ? 'Update Art Post' : 'Share With Community'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default PostForm;