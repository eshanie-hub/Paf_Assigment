import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

export const EventManagementUpdate = () => {  
  
  

  return (
    <Container className='p-4'>
      <h3 className='mb-4'>Update Event</h3>
      <Form>
      <Form.Group className='mb-3'>
  <Form.Label>Event Title</Form.Label>
  <Form.Control
    type='text'
    name='title'
    value={eventData.title}
    onChange={handleChange}
    maxLength={60}
    placeholder="Max 60 characters"
  />
  <small className="text-muted">{eventData.title.length}/60 characters</small>
</Form.Group>


<Form.Group className='mb-3'>
  <Form.Label>Description</Form.Label>
  <Form.Control
    as='textarea'
    rows={3}
    name='description'
    value={eventData.description}
    onChange={handleChange}
    placeholder="Minimum 50 characters required"
    className={eventData.description.length > 0 && eventData.description.length < 50 ? 'border border-danger' : ''}
  />
  <small className={`text-${eventData.description.length < 50 ? 'danger' : 'muted'}`}>
    Need more than 50 characters
  </small>
</Form.Group>


        <Form.Group className='mb-3 d-flex gap-3'>
        <div className='flex-grow-1'>
  <Form.Label>Date</Form.Label>
  <Form.Control
    type='date'
    name='eventDate'
    value={eventData.eventDate}
    min={new Date().toISOString().split("T")[0]} // sets min to today
    onChange={handleChange}
  />
</div>

          <div className='flex-grow-1'>
            <Form.Label>Time</Form.Label>
            <Form.Control
              type='time'
              name='eventTime'
              value={eventData.eventTime}
              onChange={handleChange}
            />
          </div>
        </Form.Group>

        
        <Form.Group className='mb-3 d-flex gap-3'>
          <div className='flex-grow-1'>
            <Form.Label>Type</Form.Label>
            <Form.Select name='type' value={eventData.type} onChange={handleChange}>
              <option value='' disabled>Select Event Type</option>
              <option value='Physical'>Physical</option>
              <option value='Online'>Online</option>
            </Form.Select>
          </div>

          {eventData.type === 'Physical' && (
            <div className='flex-grow-1'>
              <Form.Label>Location</Form.Label>
              <Form.Control
                type='text'
                name='location'
                value={eventData.location}
                onChange={handleChange}
                placeholder="Enter physical address"
              />
            </div>
          )}

          {eventData.type === 'Online' && (
            <div className='flex-grow-1'>
              <Form.Label>Event Link</Form.Label>
              <Form.Control
                type='url'
                name='link'
                value={eventData.link}
                onChange={handleChange}
                placeholder="Paste online meeting link"
              />
            </div>
          )}
        </Form.Group>

        <Form.Group className='mb-3'>
  <Form.Label>Category</Form.Label>
  <Form.Select
    name="category"
    value={eventData.category}
    onChange={handleChange}
  >
    <option value="" disabled>Select Category</option>
    <option value="Workshop">Workshop</option>
    <option value="Seminar">Seminar</option>
    <option value="Conference">Conference</option>
  </Form.Select>
</Form.Group>



              <Form.Group className='mb-3'>
        <Form.Label>Registration Fee ($)</Form.Label>
        <Form.Control
          type='text'
          name='registrationFee'
          value={eventData.registrationFee}
          placeholder="Enter numeric value"
          onChange={(e) => {
            const value = e.target.value;
            // Allow only numbers and optional one decimal point
            if (/^\d*\.?\d{0,2}$/.test(value)) {
              handleChange(e);
            }
          }}
        />
        
      </Form.Group>


        <Form.Group className='mb-3'>
          <Form.Label>Participants</Form.Label>
          <Form.Control
            type='text'
            name='maxParticipants'
            value={eventData.maxParticipants}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only numbers and optional one decimal point
              if (/^\d*\.?\d{0,2}$/.test(value)) {
                handleChange(e);
              }
            }}
          />
        </Form.Group>

        <Form.Group className='mb-3'>
        <Form.Label>
            {eventData.category === "Workshop"
              ? "Facilitator Name"
              : eventData.category === "Seminar"
              ? "Speaker Name"
              : eventData.category === "Conference"
              ? "Keynote Speaker"
              : "Instructor Name"}
         </Form.Label>
          <Form.Control
            type='text'
            name='instructorName'
            value={eventData.instructorName}
            onChange={(e) => {
              const onlyLetters = e.target.value;
              if (/^[A-Za-z.\s]*$/.test(onlyLetters)) {
                handleChange(e);
              }
            }}

          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>{eventData.category === "Workshop"
              ? "Facilitator Bio"
              : eventData.category === "Seminar"
              ? "Speaker Bio"
              : eventData.category === "Conference"
              ? "Keynote Bio"
              : "Instructor Bio"}</Form.Label>
          <Form.Control
            as='textarea'
            rows={3}
            name='instructorBio'
            value={eventData.instructorBio}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant='success' onClick={handleUpdate}>Update Event</Button>
      </Form>
    </Container>
  );
};
