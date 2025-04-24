import React, { useEffect, useRef, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import Modal from "react-modal";
import 'bootstrap-icons/font/bootstrap-icons.css';

const localizer = momentLocalizer(moment);
Modal.setAppElement("#root");

const CustomToolbar = ({ date, onNavigate }) => {
    const goToBack = () => onNavigate("PREV");
    const goToNext = () => onNavigate("NEXT");
    const label = moment(date).format("MMMM YYYY");
  
    return (
      <div className="d-flex justify-content-between align-items-center mb-2 px-3">
        <button className="btn btn-outline-secondary btn-sm" onClick={goToBack}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <span className="fw-bold">{label}</span>
        <button className="btn btn-outline-secondary btn-sm" onClick={goToNext}>
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    );
  };

export const LearningPlanCalendar = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [popoverStyle, setPopoverStyle] = useState({});
    const calendarRef = useRef();
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        axios.get("http://localhost:8080/api/learningPlan")
          .then(res => {
            const formattedEvents = res.data.map((plan, index) => {
              const date = plan.date.trim();
              const startTime = plan.startTime.trim();
              const [startHour, startMinute] = startTime.split(":").map(Number);
              const endTime = plan.endTime.trim();
              const [endHour, endMinute] = endTime.split(":").map(Number);
    
              const start = new Date(`${date}T${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`);
              const end = new Date(`${date}T${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`);
              const isUrgent = plan.title.toLowerCase().includes("urgent");
              return {
                id: plan.id || String(index),
                title: plan.title,
                description: plan.description,
                start,
                end,
                isUrgent,
                style: {
                  backgroundColor: isUrgent ? '#dc3545' : '#0d6efd', // Bootstrap red/blue
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                }
              };
              
            });
            setEvents(formattedEvents);
          });
      }, [events]);
    
      const handleSelectEvent = (event, e) => {
        setSelectedEvent(event);
    
        const calendarBounds = calendarRef.current.getBoundingClientRect();
        const left = e.clientX - calendarBounds.left + 10;
        const top = e.clientY - calendarBounds.top - 100;
    
        setPopoverStyle({
          position: "absolute",
          top: `${top}px`,
          left: `${left}px`,
          zIndex: 1000,
        });
      };
    
      const handleClose = () => setSelectedEvent(null);
    
      const handleDelete = () => {
        axios.delete(`http://localhost:8080/api/learningPlan/${selectedEvent.id}`)
          .then(() => {
            setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
            handleClose();
          });
      };
      
return (
    <div ref={calendarRef} style={{ height: "500px", position: "relative", padding: "20px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
        views={['month']}
        defaultView="month"
        toolbar={true}
        components={{ toolbar: CustomToolbar }}
        onSelectEvent={(event, e) => handleSelectEvent(event, e)}
        eventPropGetter={(event) => {
          return {
            style: event.style || {}
          };
        }}
      />

    {selectedEvent && (
      <div className="card shadow border-0" style={{ ...popoverStyle, borderLeft: `5px solid ${selectedEvent.isUrgent ? '#dc3545' : '#0d6efd'}` }}>
        <div className="card-body" >
          <h5 className="card-title d-flex align-items-center">
            {selectedEvent.isUrgent && <i className="bi bi-exclamation-triangle-fill text-danger me-2"></i>}
            {selectedEvent.title}
          </h5>
          <p className="mb-2 text-muted small">
            <i className="bi bi-calendar-event"></i> {moment(selectedEvent.start).format('dddd, MMMM Do YYYY')}
          </p>
          <p className="mb-2">
            <strong>Time:</strong> {moment(selectedEvent.start).format('h:mm A')} – {moment(selectedEvent.end).format('h:mm A')}
          </p>
          <p>
            <strong>Description:</strong> {selectedEvent.description}
          </p>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-sm" style={{  borderColor: "#FF0051", color: "black" }} type="submit">
                <a href={`/pages/learning_plan/Learning_plan_update/${selectedEvent.id}`} style={{textDecoration: 'none', color:'black'}}>
                Update
                </a>
              </button>
            <button className="btn btn-sm btn-danger" onClick={handleDelete}>Delete</button>
            <button className="btn btn-sm btn-secondary" onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};
