import React, { useState } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';



export const EventManagementCreate = () => {
  const [eventData, setEventData] = useState({  //eventData is a state object that holds all the form fields
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    location: '',
    category: '',
    registrationFee: '',
    maxParticipants: '',
    instructorName: '',
    instructorBio: '',
    userId: 3, // replace this if using auth
  });
  const payload = {
    ...eventData,
    registrationFee: Number(eventData.registrationFee),
    maxParticipants: Number(eventData.maxParticipants),
    type: eventData.type,
  link: eventData.link,
  };
  

  const navigate = useNavigate();

 


  const handleChange = (e) => {  //Captures input changes for any field.
                                       //Dynamically updates the corresponding field in eventData.
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

  const handleSubmit = async () => {
    const {
      title, description, eventDate, eventTime, location, link,
      category, registrationFee, maxParticipants,
      instructorName, instructorBio, type
    } = eventData;
  
    if (
      !title || !description || !eventDate || !eventTime ||
      !category || !registrationFee || !maxParticipants ||
      !instructorName || !instructorBio || !type
    ) {
      return Swal.fire({
        icon: 'warning',
        title: 'All fields are required!',
      });
    }
  
    if (type === 'Online' && (!link || link.trim() === '')) {
      return Swal.fire({
        icon: 'warning',
        title: 'Event link is required for online events.',
      });
    }
  
    if (type === 'Physical' && (!location || location.trim() === '')) {
      return Swal.fire({
        icon: 'warning',
        title: 'Event location is required for physical events.',
      });
    }
  
    if (title.length > 60) {
      return Swal.fire({
        icon: 'error',
        title: 'Title should be 60 characters or less.',
      });
    }
  
    if (description.length < 50) {
      return Swal.fire({
        icon: 'error',
        title: 'Description must be at least 50 characters.',
      });
    }
  
    if (instructorBio.length < 30) {
      return Swal.fire({
        icon: 'error',
        title: 'Bio must be at least 30 characters long.',
      });
    }
  
    if (isNaN(registrationFee)) {
      return Swal.fire({
        icon: 'error',
        title: 'Registration fee must be a number.',
      });
    }
  
    if (isNaN(maxParticipants)) {
      return Swal.fire({
        icon: 'error',
        title: 'Max participants must be a number.',
      });
    }
  
    try {
      const response = await axios.post('http://localhost:8080/api/events', payload);
      Swal.fire({
        icon: 'success',
        title: 'Event created successfully!',
        text: 'Redirecting to browse page...',
        showConfirmButton: false,
        timer: 1500,
      });
  
      setTimeout(() => {
        navigate('/pages/event_management/Event_management_browse');
      }, 1500);
  
      setEventData({
        title: '',
        description: '',
        eventDate: '',
        eventTime: '',
        type: '',
        location: '',
        link: '',
        category: '',
        registrationFee: '',
        maxParticipants: '',
        instructorName: '',
        instructorBio: '',
        userId: 2,
      });
    } catch (error) {
      console.error('Error creating event:', error);
      if (error.response?.data) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Error: ${JSON.stringify(error.response.data)}`,
        });
      }
    }
  };
  
  
  

  return (
    <div>
      <div>
        <h2 className='pb-2 text-left fw-bold'>Host an Event</h2>
        <p className='text-left w-100 fw-sm'>
          Share your creative skills with the community by hosting an event. Fill out the form below with your event details.
        </p>
      </div>

      <Container className='p-4 bg-white rounded'>
        <h5 className="fw-bold">Create a New Event</h5>

        <div className='mt-2 d-flex flex-column'>
  <p className='mb-1'>Event Title</p>
  <input
    type="text"
    name="title"
    className="form-control"
    placeholder="Enter event title"
    maxLength={60}
    value={eventData.title}
    onChange={handleChange}
  />
  <small className="text-muted">{eventData.title.length}/60 characters</small>
</div>


<div className="mt-4 d-flex flex-column">
  <p className="mb-1">Description</p>
  <textarea
    name="description"
    className={`form-control ${eventData.description.length > 0 && eventData.description.length < 50 ? 'border border-danger' : ''}`}
    placeholder="Enter event description (min 50 characters)"
    value={eventData.description}
    onChange={handleChange}
  />
  <small className={`mt-1 ${eventData.description.length < 50 ? 'text-danger' : 'text-muted'}`}>
    Need more than 50 characters
  </small>
</div>


        <div className='mt-3 d-flex gap-3 w-100'>
          <div className='mt-2 flex-grow-1'>
            <p className='mb-1'>Event Date</p>
            <input
              type="date"
              name="eventDate"
              className="form-control"
              min={new Date().toISOString().split("T")[0]} // disables past dates
              value={eventData.eventDate}
              onChange={handleChange}
            />
          </div>
          <div className='mt-2 flex-grow-1'>
            <p className='mb-1'>Event Time</p>
            <input
              type="time"
              name="eventTime"
              className="form-control"
              min={eventData.eventDate === new Date().toISOString().split("T")[0] ? new Date().toTimeString().split(' ')[0].slice(0, 5) : undefined}
              value={eventData.eventTime}
              onChange={handleChange}
            />
          </div>
        </div>


        <div className='mt-3 d-flex gap-3 w-100'>
            <div className="mt-2 flex-grow-1">
              <p className="mb-1">Type</p>
              <select
                name="type"
                className="form-select"
                value={eventData.type || ''}
                onChange={handleChange}
              >
                <option value="" disabled>Select Event Type</option>
                <option value="Physical">Physical</option>
                <option value="Online">Online</option>
              </select>
            </div>

            {eventData.type === "Physical" && (
              <div className='mt-2 flex-grow-2 w-100'>
                <p className='mb-1'>Event Location</p>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  placeholder="Enter physical address"
                  value={eventData.location}
                  onChange={handleChange}
                />
              </div>
            )}

            {eventData.type === "Online" && (
              <div className='mt-2 flex-grow-2 w-100'>
                <p className='mb-1'>Event Link</p>
                <input
                  type="url"
                  name="link"
                  className="form-control"
                  placeholder="Paste online meeting link"
                  value={eventData.link}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>


        <div className='mt-3 d-flex gap-3 w-100'>
        <div className="mt-2 flex-grow-1">
          <p className="mb-1">Category</p>
          <select
            name="category"
            className="form-select"
            value={eventData.category}
            onChange={handleChange}
          >
            <option value="" disabled>Select Category</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Conference">Conference</option>
          </select>
        </div>

          <div className='mt-2 flex-grow-1'>
            <p className='mb-1'>Registration Fee ($)</p>
            <input
                type="text"
                name="registrationFee"
                className="form-control"
                placeholder="Enter registration fee"
                value={eventData.registrationFee}
                onChange={(e) => {
                  if (/^\d*\.?\d*$/.test(e.target.value)) {
                    handleChange(e);
                  }
                }}
              />
          </div>

          <div className='mt-2 flex-grow-1'>
            <p className='mb-1'>Maximum Participants</p>
            <input
              type="text"
              name="maxParticipants"
              className="form-control"
              placeholder="Enter maximum participants"
              value={eventData.maxParticipants}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) {
                  handleChange(e);
                }
              }}
            />
          </div>
        </div>

        <div className='mt-4 d-flex flex-column'>
          <p className='mb-1'>
            {eventData.category === "Workshop"
              ? "Facilitator Name"
              : eventData.category === "Seminar"
              ? "Speaker Name"
              : eventData.category === "Conference"
              ? "Keynote Speaker"
              : "Instructor Name"}
          </p>
          <input
            type="text"
            name="instructorName"
            className="form-control"
            placeholder="Enter name"
            value={eventData.instructorName}
            onChange={(e) => {
              const onlyLetters = e.target.value;
              if (/^[A-Za-z.\s]*$/.test(onlyLetters)) {
                handleChange(e);
              }
            }}
          />
        </div>



        <div className="mt-4 d-flex flex-column">
        <p className='mb-1'>
            {eventData.category === "Workshop"
              ? "Facilitator Bio"
              : eventData.category === "Seminar"
              ? "Speaker Bio"
              : eventData.category === "Conference"
              ? "Keynote Bio"
              : "Instructor Bio"}
          </p>
          <textarea name="instructorBio" className="form-control" placeholder="Tell participants about instructor" rows={3}
            value={eventData.instructorBio} onChange={handleChange} />
          
        </div>

        <div className='d-flex justify-content-end mt-3'>
          <button className='btn btn-primary' onClick={handleSubmit}>Create Event</button>
        </div>
      </Container>
    </div>
  );
};
