import React, { useState, useEffect } from 'react';
import {
  Form,
  Card,
  Button,
  Spinner,
  Image,
  Row,
  Col
} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const PostForm = ({
  postText,
  setPostText,
  mediaFiles,
  setMediaFiles,
  existingMedia,
  setExistingMedia,
  isLoading,
  handleSubmit,
  handleRemoveExistingMedia,
  handleRemoveNewMedia,
  visibility,
  setVisibility,
  editingPost,
  onCancel,
  validationErrors
}) => {
  const [mediaPreviews, setMediaPreviews] = useState([]);

  const buttonColor = '#F4C3D2';
  const textColor = '#2d3436';
  const primaryColor = '#2d3436';

  useEffect(() => {
    // Generate previews for new files
    const newPreviews = mediaFiles.map(file => {
      const preview = URL.createObjectURL(file);
      return {
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: preview,
        file,
        isNew: true
      };
    });

    // Combine with existing media
    const combined = [
      ...existingMedia.map(media => ({
        type: media.mediaType,
        url: media.url,
        id: media.id,
        isNew: false
      })),
      ...newPreviews
    ];

    setMediaPreviews(combined);

    // Cleanup function
    return () => {
      newPreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [mediaFiles, existingMedia]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
  };

  return (
    <Card className="mb-4 shadow-sm border-0" style={{ backgroundColor: '#E7ECF8' }}>
      <Card.Header className="border-0" style={{ backgroundColor: 'transparent' }}>
        <h5 className="m-0" style={{ color: primaryColor, fontWeight: '600' }}>
          <i className="bi bi-palette me-2"></i>
          {editingPost ? 'Edit Art Post' : 'Share Your Artwork'}
        </h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="position-relative mb-3">
            <Form.Control
              as="textarea"
              rows={4}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Describe your artwork, techniques used, or inspiration behind it..."
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

          {/* Media Previews */}
          {mediaPreviews.length > 0 && (
            <div className="mt-3">
              <Row>
                {mediaPreviews.map((media, index) => (
                  <Col key={media.isNew ? `new-${index}` : `existing-${media.id}`} 
                       xs={12} sm={6} md={4} className="mb-3">
                    <div className="media-preview-wrapper shadow-sm rounded overflow-hidden position-relative">
                      {media.type === 'image' ? (
                        <Image
                          src={media.url}
                          alt="Media preview"
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <video
                          controls
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        >
                          <source src={media.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                      <Button
                        variant="light"
                        size="sm"
                        className="position-absolute top-0 end-0 m-2 p-1 rounded-circle shadow-sm"
                        onClick={() => {
                          if (media.isNew) {
                            handleRemoveNewMedia(mediaFiles.findIndex(f => f === media.file));
                          } else {
                            handleRemoveExistingMedia(media.id);
                          }
                        }}
                        style={{
                          backgroundColor: '#fff',
                          color: '#d63031',
                          border: '1px solid #d63031',
                        }}
                      >
                        <i className="bi bi-x"></i>
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* File Input */}
          <Form.Group className="mb-3">
            <Form.Control
              type="file"
              multiple
              onChange={handleFileSelect}
              accept="image/*,video/*"
              isInvalid={!!validationErrors.mediaFiles || 
                         !!validationErrors.videoLimit || 
                         !!validationErrors.mixedMedia || 
                         !!validationErrors.imageLimit || 
                         !!validationErrors.tooManyImages}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.mediaFiles || 
               validationErrors.videoLimit || 
               validationErrors.mixedMedia || 
               validationErrors.imageLimit ||
               validationErrors.tooManyImages}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Visibility Selector */}
          <Form.Group className="mb-3">
            <Form.Label>Visibility</Form.Label>
            <Form.Select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </Form.Select>
          </Form.Group>

          {/* Submit Button */}
          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="light"
              onClick={onCancel}
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
              ) : editingPost ? (
                'Update Art Post'
              ) : (
                'Share With Community'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PostForm;