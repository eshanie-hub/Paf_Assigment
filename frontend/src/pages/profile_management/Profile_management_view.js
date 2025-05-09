import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useSelector } from 'react-redux';

export const ProfileManagementView = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Get current user ID from local storage
  //const currentUserId = localStorage.getItem('userId');
  const userId = useSelector(state =>state.userId);


  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserProfile(selectedUserId);
    } else if (userId) {
      setSelectedUserId(userId);
    }
  }, [selectedUserId, userId]);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setUser(response.data);
      setUsername(response.data.username);
      setEmail(response.data.email);
      setPreviewUrl(response.data.profilePhotoUrl || '/default-profile.png');
    } catch (error) {
      toast.error('Failed to fetch profile');
      console.error('Error fetching profile:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('/api/users/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setAllUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('username', username);
    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto);
    }

    try {
      const response = await axios.put(`/api/users/${userId}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUser(response.data.user);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      fetchAllUsers(); // Refresh the user list
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (targetUserId) => {
    try {
      await axios.post(`/api/users/${userId}/follow/${targetUserId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      toast.success('Successfully followed user');
      fetchAllUsers(); // Refresh the user list
    } catch (error) {
      toast.error('Failed to follow user');
      console.error('Error following user:', error);
    }
  };
  
  const handleUnfollow = async (targetUserId) => {
    try {
      await axios.delete(`/api/users/${userId}/unfollow/${targetUserId}`,{withCredentials:true} ,{
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('token')}`
        // }
      });
      
      toast.success('Successfully unfollowed user');
      fetchAllUsers(); // Refresh the user list
    } catch (error) {
      toast.error('Failed to unfollow user');
      console.error('Error unfollowing user:', error);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
  };

  if (!user) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <div className="spinner-border" role="status" style={{ color: '#F4C3D2' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <Container className="mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Horizontal User Cards Section */}
      <Row className="mb-4">
        <Col>
          <h4 className="mb-3">Select a Profile</h4>
          <div className="d-flex overflow-auto pb-3" style={{ gap: '15px' }}>
            {allUsers.map((userItem) => (
              <Card 
                key={userItem.id} 
                className="flex-shrink-0" 
                style={{ 
                  width: '150px',
                  borderColor: selectedUserId === userItem.id ? '#F4C3D2' : '#dee2e6',
                  borderWidth: selectedUserId === userItem.id ? '2px' : '1px'
                }}
              >
                <Card.Body className="text-center p-2">
                  <Image 
                    src={userItem.profilePhotoUrl || '/default-profile.png'} 
                    roundedCircle 
                    fluid 
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      objectFit: 'cover',
                      border: '2px solid #F4C3D2',
                      marginBottom: '10px'
                    }}
                  />
                  <h6 className="mb-2">{userItem.username}</h6>
                  
                  {userItem.id !== userId && (
                    <div className="d-flex justify-content-center gap-2">
                      <Button 
                        variant={userItem.isFollowing ? "outline-primary" : "primary"} 
                        size="sm"
                        onClick={() => userItem.isFollowing ? handleUnfollow(userItem.id) : handleFollow(userItem.id)}
                        style={{ 
                          backgroundColor: userItem.isFollowing ? 'transparent' : '#F4C3D2',
                          borderColor: '#F4C3D2',
                          color: '#000',
                          borderRadius: '10px'
                        }}
                      >
                        {userItem.isFollowing ? 'Following' : 'Follow'}
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => handleUserSelect(userItem.id)}
                        style={{ 
                          borderColor: '#F4C3D2',
                          color: '#000',
                          borderRadius: '10px'
                        }}
                      >
                        View
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>
      </Row>
      
      {/* Profile Section */}
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm" style={{ border: 'none', borderRadius: '15px' }}>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={4} className="text-center">
                  <div className="position-relative mb-4">
                    <Image 
                      src={previewUrl} 
                      roundedCircle 
                      fluid 
                      style={{ 
                        width: '150px', 
                        height: '150px', 
                        objectFit: 'cover',
                        border: '3px solid #F4C3D2'
                      }}
                      className="mb-3"
                    />
                    {isEditing && selectedUserId === userId && (
                      <div className="position-absolute bottom-0 end-0">
                        <label htmlFor="profilePhoto" className="btn btn-sm btn-light rounded-circle p-2" style={{ backgroundColor: '#FFF5F7' }}>
                          <i className="bi bi-camera-fill text-dark"></i>
                        </label>
                        <input 
                          type="file" 
                          id="profilePhoto" 
                          onChange={handleFileChange} 
                          accept="image/*" 
                          style={{ display: 'none' }} 
                        />
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={8}>
                  {isEditing ? (
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-muted">Username</Form.Label>
                        <Form.Control
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          style={{ borderRadius: '10px', borderColor: '#F4C3D2' }}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-muted">Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={email}
                          readOnly
                          plaintext
                          className="text-dark"
                        />
                      </Form.Group>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="light" 
                          onClick={() => setIsEditing(false)}
                          style={{ 
                            backgroundColor: '#FFF5F7',
                            borderColor: '#F4C3D2',
                            color: '#000',
                            borderRadius: '10px'
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="primary" 
                          type="submit"
                          disabled={loading}
                          style={{ 
                            backgroundColor: '#F4C3D2',
                            border: 'none',
                            color: '#000',
                            borderRadius: '10px'
                          }}
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <div>
                      <h3 className="mb-3">{username}</h3>
                      <p className="text-muted mb-4">{email}</p>
                      {selectedUserId === userId && (
                        <Button 
                          variant="primary"
                          onClick={() => setIsEditing(true)}
                          style={{ 
                            backgroundColor: '#F4C3D2',
                            border: 'none',
                            color: '#000',
                            borderRadius: '10px'
                          }}
                        >
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};