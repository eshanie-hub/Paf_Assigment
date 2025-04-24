import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock ,FaExternalLinkAlt} from 'react-icons/fa';
import axios from 'axios';

export const EventManagementBrowse = () => {
 

  return (
    <div className="p-2">
      <h2 className="pb-2 text-left fw-bold">Explore Events</h2>

      <div className="d-flex justify-content-between align-items-end gap-3 w-100 mb-3">
        <div className="flex-grow-1">
          <p className="mb-1">Categories</p>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="form-select"
          >
            <option value="">All</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Conference">Conference</option>
          </select>
        </div>

        <div className="flex-grow-1">
          <p className="mb-1">Sort By</p>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="form-select"
          >
            <option value="">Default</option>
            <option value="date">Date (Upcoming)</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>

        <div>
          <p className="invisible mb-1">.</p>
          <button
            className="btn btn-outline-secondary w-100"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>

      <Row className="p-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.slice(0, visibleCount).map((event, idx) => (
            <Col key={idx} md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Badge bg="primary">{event.category}</Badge>
                    </div>

                    <Card.Title>{event.title}</Card.Title>
                    <Card.Text>{event.description}</Card.Text>

                    <div className="d-flex text-muted small mb-2">
                      <div className="d-flex gap-5">
                        <div>
                          <FaCalendarAlt className="me-1 mb-1" /> {event.eventDate}
                        </div>
                        <div>
                          <FaClock className="me-1" /> {event.eventTime}
                        </div>
                      </div>
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
                      <FaUsers className="me-2" />
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
                      <a
                        href={`/pages/event_management/Event_management_single_view/${event.id}`}
                      >
                        <Button variant="outline-primary">View Details</Button>
                      </a>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="mt-4 text-muted">No events found</p>
        )}
      </Row>

      {visibleCount < filteredEvents.length && (
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-outline-primary"
            onClick={() => setVisibleCount((prev) => prev + 6)}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};
