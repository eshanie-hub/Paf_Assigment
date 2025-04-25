package com.paf_assigment.paf.event_management.controller;

import com.paf_assigment.paf.event_management.model.Event;
import com.paf_assigment.paf.event_management.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*") // Allow React frontend to connect
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();  // Returns a JSON array of events
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventService.createEvent(event);
    }

    @GetMapping("/{id}")
    public Event getEvent(@PathVariable Long id) {
        return eventService.getEventById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }

    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
        return eventService.updateEvent(id, updatedEvent);
    }

    // Register a user to an event
    @PutMapping("/{id}/register")
    public Event registerUser(@PathVariable Long id, @RequestParam Long userId) {
        return eventService.registerUser(id, userId);
    }

    // Unregister a user from an event
    @PutMapping("/{id}/unregister")
    public Event unregisterUser(@PathVariable Long id, @RequestParam Long userId) {
        return eventService.unregisterUser(id, userId);
    }
}
