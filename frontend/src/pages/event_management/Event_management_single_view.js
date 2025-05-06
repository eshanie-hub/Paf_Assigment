import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Badge } from 'react-bootstrap';
import { Form, Card, Spinner } from 'react-bootstrap';
import {
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaShareAlt, FaClock, FaExternalLinkAlt
} from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

export const EventManagementSingleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = Number(useSelector((state) => state.userId)?.replace(/"/g, ''));
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [visibleComments, setVisibleComments] = useState(3);

  useEffect(() => {
    const fetchSingleEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/events/${id}`, { withCredentials: true });
        setEvent(res.data);
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/events/${id}/comments`, { withCredentials: true });
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchSingleEvent();
    fetchComments();
  }, [id]);

  useEffect(() => {
    if (event?.registeredUsers) {
      setIsRegistered(event.registeredUsers.includes(userId));
    }
  }, [event, userId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Link copied!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
    });
  };

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This event will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/events/${id}`, { withCredentials: true });
        Swal.fire({ icon: 'success', title: 'Deleted!', toast: true, timer: 2000 });
        navigate('/pages/event_management/Event_management_browse');
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Delete failed' });
      }
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.put(`http://localhost:8080/api/events/${id}/register?userId=${userId}`, null, { withCredentials: true });
      setEvent(res.data);
      setIsRegistered(true);
    } catch (err) {
      console.error("Registration failed", err);
      Swal.fire({ icon: 'error', title: 'Registration failed' });
    }
  };

  const handleUnregister = async () => {
    try {
      const res = await axios.put(`http://localhost:8080/api/events/${id}/unregister?userId=${userId}`, null, { withCredentials: true });
      setEvent(res.data);
      setIsRegistered(false);
    } catch (err) {
      console.error("Unregistration failed", err);
      Swal.fire({ icon: 'error', title: 'Unregistration failed' });
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
  
    // Get and clean name from localStorage
    const persistedState = JSON.parse(localStorage.getItem('persist:root'));
    const rawName = persistedState?.name;
    const username = rawName ? rawName.replace(/\\|"/g, '') : 'Anonymous';
  
    try {
      await axios.post(
        `http://localhost:8080/api/events/${id}/comments`,
        {
          content: newComment,
          userId,
          username,
        },
        { withCredentials: true }
      );
  
      const updatedComments = await axios.get(
        `http://localhost:8080/api/events/${id}/comments`,
        { withCredentials: true }
      );
      setComments(updatedComments.data);
      setNewComment('');
    } catch (err) {
      console.error('Post comment failed', err);
      Swal.fire({ icon: 'error', title: 'Post failed' });
    }
  };
  

  const handleDeleteComment = async (commentId) => {
    const confirm = await Swal.fire({
      title: 'Delete this comment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:8080/api/comments/${commentId}`,
          {
            withCredentials: true,
            headers: {
              userId: userId
            }
          }
        );
        
        setComments((prev) => prev.filter(c => c.id !== commentId));
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Delete failed' });
      }
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleUpdateComment = async () => {
    if (!editingContent.trim()) return;

    try {
      const res = await axios.put(
        `http://localhost:8080/api/comments/${editingCommentId}`,
        { content: editingContent },
        {
          withCredentials: true,
          headers: {
            userId: userId
          }
        }
      );
      

      setComments(comments.map(c => c.id === editingCommentId ? res.data : c));
      setEditingCommentId(null);
      setEditingContent('');
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Update failed' });
    }
  };

  const handleShowMore = () => setVisibleComments(prev => prev + 3);

  if (!event) return <div className="p-4">Loading...</div>;

  const isFull = event.registeredUsers.length >= event.maxParticipants;

  
  return (
    <div>
      
        
    <div  className="mb-4">
      <div className='p-2 d-flex justify-content-between'>
        <div className='p-2 w-75'>
              <div className='d-flex align-items-center justify-content-between'>
                <Badge bg="primary" className="mb-2">{event.category}</Badge>
                <div className='d-flex gap-4 '>
                  
                <div>
  <Button variant="outline-secondary" onClick={handleCopyLink}>
    <FaShareAlt className="me-1" title="Share this event" />
    Share This
  </Button>
</div>

                </div>
              </div>
              
              <h2 className='pb-2 mt-3 text-center fw-bold w-100'>{event.title}</h2>

              <div>
                <div className='d-flex gap-5 '>
                             <div><FaCalendarAlt className="me-1  mb-1" /> {event.eventDate}</div>
                          <div><FaClock className="me-1"/> {event.eventTime}</div>
                               </div>
                      <div className='d-flex py-2 align-items-center'>
                      {event.type === 'Online' ? (
                        <>
                          <FaExternalLinkAlt className='me-2' />
                          <a href={event.link} target="_blank" rel="noopener noreferrer">
                            {event.link}
                          </a>
                        </>
                      ) : (
                        <>
                          <FaMapMarkerAlt className='me-2' />
                          <span>{event.location}</span>
                        </>
                      )}
                    </div>

                <div className='d-flex pb-2 align-items-center'>
                  <FaUsers color='' className="me-2" />
                  <span>{event.maxParticipants} Participants</span>
                </div>
              </div>

              {event.userId === userId && (
  <div className='d-flex justify-content-end gap-3'>
    <div>
      <button
        className='btn btn-warning'
        onClick={() => navigate(`/pages/event_management/Event_management_update/${id}`)}
      >
        Update Event
      </button>
    </div>
    <div>
      <button className='btn btn-danger' onClick={handleDelete}>
        Delete Event
      </button>
    </div>
  </div>
)}


              <div className='p-2 mt-4 bg-white rounded'>
                <h5 className='fw-bold'>About this Event</h5>
                <p>{event.description}</p>
              </div>

              <div className="mt-5">
  <h5>Comments ({comments.length})</h5>

  {/* New Comment Input */}
  <Form>
    <Form.Group controlId="newComment">
      <Form.Control
        as="textarea"
        rows={3}
        placeholder="Write a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="mb-3"
      />
    </Form.Group>
    <div className="d-flex justify-content-end">
      <Button variant="primary" onClick={handlePostComment}>
        Post Comment
      </Button>
    </div>
  </Form>

  {/* Existing Comments List */}
  <div className="mt-4">
    {comments.slice(0, visibleComments).map((comment) => (
      <Card key={comment.id} className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between">
            <strong>{comment.username}</strong>
            {userId  === comment.userId && editingCommentId !== comment.id && (
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleEditComment(comment)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>

          {editingCommentId === comment.id ? (
            <>
              <Form.Control
                as="textarea"
                rows={2}
                className="mt-2"
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
              />
              <div className="mt-2 d-flex justify-content-end gap-2">
                <Button size="sm" variant="success" onClick={handleUpdateComment}>
                  Save
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setEditingCommentId(null)}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <Card.Text className="mt-2">{comment.content}</Card.Text>
          )}
        </Card.Body>
      </Card>
    ))}

    {visibleComments < comments.length && (
      <div className="d-flex justify-content-center mt-2">
        <Button size="sm" variant="outline-primary" onClick={handleShowMore}>
          Show More
        </Button>
      </div>
    )}
  </div>
</div>

            
        </div>
          <div className='w-25 mt-5 p-1 d-flex flex-column'>
            <div className='bg-white rounded p-2'>
            <h5 className='fw-bold '>Registration</h5>
            <div className='d-flex justify-content-between fw-semibold mt-3'>
              <p>Registration Fee:</p>
              <p className='text-color-blue' >$ {event.registrationFee}</p>
            </div>
            {isRegistered ? (
                <button className='btn btn-outline-danger w-100' onClick={handleUnregister}>
                  Unregister
                </button>
              ) : (
                <button className='btn btn-primary w-100' onClick={handleRegister} disabled={isFull}>
                  {isFull ? "Event Full" : "Register"}
                </button>
              )}


            <div className='mt-3 text-secondary'>
            
            </div>
            </div>

            {/* <div className='mt-4 p-2 bg-white rounded '>
              <h5 className='fw-bold'>Hosted By</h5>
              <div className='d-flex w-100 align-items-center gap-2'>
                <img src='/ProfilePic.png' alt="avatar" className="rounded-circle me-2" width={35} height={35} />
                <strong>{event.instructorName}</strong>
                </div>
            </div> */}

            <div className='mt-5 p-2 bg-white rounded'>
              <div>
              <h5 className='mb-1 fw-bold'>
  {event.category === "Workshop"
    ? "Facilitator Name"
    : event.category === "Seminar"
    ? "Speaker Name"
    : event.category === "Conference"
    ? "Keynote Speaker"
    : "Instructor Name"}
</h5>

                {/* <h5 className='fw-bold'>Instructor</h5> */}
                <div className='d-flex w-100 align-items-center gap-2'>
                  <img src='/ProfilePic.png' alt="avatar" className="rounded-circle me-2" width={35} height={35} />
                  <strong>{event.instructorName}</strong>
                </div>
                <p className='mt-3'>
                  {event.instructorBio}
                  </p>
              </div>
            </div>

          </div>
        <div>
        
        </div>
      </div>
    </div>        
            
      
    </div>
  );
};
