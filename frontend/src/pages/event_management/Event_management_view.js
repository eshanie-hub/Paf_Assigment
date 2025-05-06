import React from 'react';
import { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock,FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';

export const  EventManagementView = () => {
  
  const [latestEvents, setLatestEvents] = useState([]);  //Initializes the state as an empty array by useState(), latestEvents holds the list of events


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/events');
      
        const today = new Date(); 

        // Sort events by eventDate ascending and get only the latest 5
        const sorted = res.data
          .filter(e => new Date(e.eventDate) >= today) // only future or today
          .sort((a, b) =>   new Date(a.eventDate) - new Date(b.eventDate))  // ascending: soonest first
          .slice(0, 5);

        setLatestEvents(sorted);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  
  return (
    <div className='p-2'>
      <h2 className='pb-2 text-center fw-bold'>Share Your Creative Skills</h2>
      <div className='d-flex justify-content-center'>
      <p className='text-center w-75'>Join our creative community to host or attend art workshops and events,
          learn new skills, teach each others and connect with fellow artists.</p>
      </div>

      <div className='d-flex justify-content-center gap-4'>
        <a href='/pages/event_management/Event_management_create'><button className='btn btn-primary'>Create Event</button></a>
        <a href='/pages/event_management/Event_management_browse'><button className='btn btn-secondary'>Explore Events</button></a>
      </div> 

      <h4 className='mt-5'>Upcoming Events</h4>
      <div>

      <Row className="p-4">
        {latestEvents.length > 0 ? (
          latestEvents.map((event, idx) => (
            <Col key={idx} md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Badge bg="primary">{event.category}</Badge>
                      
                    </div>

                    <Card.Title>{event.title}</Card.Title>
                    <Card.Text>{event.description}</Card.Text>

                    <div className='d-flex gap-5 text-muted small mb-2'>
                                            <div><FaCalendarAlt className="me-1  mb-1" /> {event.eventDate}</div>
                                            <div><FaClock className="me-1"/> {event.eventTime}</div>
                                          </div>
                    

                      <div className='d-flex py-2 align-items-center text-muted small mb-2'>
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
                    
                    <div className="text-muted small mb-3">
                      <FaUsers className="me-2 mb-1" />
                      {event.maxParticipants}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center">
                      <img
                        src="/ProfilePic.png"
                        alt="avatar"
                        className="rounded-circle me-2"
                        width={35}
                        height={35}
                      />
                      <strong>{event.instructorName}</strong>
                    </div>
                    <div>
                      <a href={`/pages/event_management/Event_management_single_view/${event.id}`}>
                                                <Button variant="outline-primary">View Details</Button>
                                              </a>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="mt-4 text-muted">No upcoming events found.</p>
        )}
      </Row>

      </div>
      
    
    </div>
  )
}
