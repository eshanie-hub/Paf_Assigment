import React, { useState } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';



export const EventManagementCreate = () => {
 
  
  

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
