package com.paf_assigment.paf.event_management.service;

import com.paf_assigment.paf.event_management.model.Event;
import com.paf_assigment.paf.event_management.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event createEvent(Event event) {
        // Initialize list if not present
        if (event.getRegisteredUsers() == null) {
            event.setRegisteredUsers(new ArrayList<>());
        }
        return eventRepository.save(event);
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public Event updateEvent(Long id, Event updatedEvent) {
        Event existing = eventRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setTitle(updatedEvent.getTitle());
            existing.setDescription(updatedEvent.getDescription());
            existing.setEventDate(updatedEvent.getEventDate());
            existing.setEventTime(updatedEvent.getEventTime());

            // Type-based logic for link/location
            existing.setType(updatedEvent.getType());
            existing.setLocation("Physical".equals(updatedEvent.getType()) ? updatedEvent.getLocation() : "");
            existing.setLink("Online".equals(updatedEvent.getType()) ? updatedEvent.getLink() : "");

            existing.setCategory(updatedEvent.getCategory());
            existing.setRegistrationFee(updatedEvent.getRegistrationFee());
            existing.setMaxParticipants(updatedEvent.getMaxParticipants());
            existing.setInstructorName(updatedEvent.getInstructorName());
            existing.setInstructorBio(updatedEvent.getInstructorBio());

            return eventRepository.save(existing);
        }

        return null;
    }

    // Register a user to an event
    public Event registerUser(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        if (event.getRegisteredUsers() == null) {
            event.setRegisteredUsers(new ArrayList<>());
        }

        if (!event.getRegisteredUsers().contains(userId)) {
            event.getRegisteredUsers().add(userId);
            return eventRepository.save(event);
        }

        return event;
    }

    // Unregister a user from an event
    public Event unregisterUser(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        if (event.getRegisteredUsers() != null) {
            event.getRegisteredUsers().remove(userId);
        }

        return eventRepository.save(event);
    }
}
