import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {  Button, Badge } from 'react-bootstrap';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaHeart, FaShareAlt, FaClock,FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';



export const  EventManagementSingleView = () => {

  

  const { id } = useParams(); // get event ID from URL
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();  //used to redirect on update
  // Assuming userId is stored in localStorage  
  // const userId = localStorage.getItem('userId');
  
  
  const userId = 3; // For testing purposes, replace with actual user ID from localStorage

  const [isRegistered, setIsRegistered] = useState(false);



useEffect(() => {
  const fetchSingleEvent = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.error("Error fetching single event:", err);
    }
  };

  fetchSingleEvent();
}, [id]);

// When event is fetched, check if user is registered
useEffect(() => {
  if (event && event.registeredUsers) {
    setIsRegistered(event.registeredUsers.includes(userId));
  }
}, [event, userId]);


  if (!event) return <p className="p-3">Loading event...</p>; //Prevents the page from crashing while event is still null

  const isFull = event.registeredUsers.length >= event.maxParticipants;


  const handleCopyLink = () => {               //Handle Share
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Link copied!',
          text: 'The event link has been copied to your clipboard.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Failed to copy the link.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
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
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/events/${id}`);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The event has been deleted.',
          timer: 2000,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timerProgressBar: true,
        });
        // Redirect back to browse page or homepage
        window.location.href = '/pages/event_management/Event_management_browse';
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete the event.',
        });
      }
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.put(`http://localhost:8080/api/events/${id}/register?userId=${userId}`);
      setEvent(res.data);
      setIsRegistered(true);
    } catch (err) {
      console.error("Registration failed", err);
      Swal.fire({ icon: 'error', title: 'Could not register.' });
    }
  };
  
  const handleUnregister = async () => {
    try {
      const res = await axios.put(`http://localhost:8080/api/events/${id}/unregister?userId=${userId}`);
      setEvent(res.data);
      setIsRegistered(false);
    } catch (err) {
      console.error("Unregister failed", err);
      Swal.fire({ icon: 'error', title: 'Could not unregister.' });
    }
  };
  
  
  
  

  
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

              <div className='mt-5'>
                <h5>Comments (2)</h5>
                <textarea className='w-100 border border-light rounded p-2' rows={3} placeholder='Write a comment...'></textarea>
              </div>

              <div className='d-flex justify-content-end mt-3'>
                <a href=''><button className='btn btn-primary'>Post Comment</button></a>
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

            <div className='mt-4 p-2 bg-white rounded '>
              <h5 className='fw-bold'>Hosted By</h5>
              <div className='d-flex w-100 align-items-center gap-2'>
                <img src='/ProfilePic.png' alt="avatar" className="rounded-circle me-2" width={35} height={35} />
                <strong>{event.instructorName}</strong>
                </div>
            </div>

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
