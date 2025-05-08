package com.paf_assigment.paf.event_management.controller;

import com.paf_assigment.paf.event_management.model.Event;
import com.paf_assigment.paf.event_management.service.EmailService;
import com.paf_assigment.paf.event_management.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
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

    //  Register a user to an event and send email
    @PutMapping("/{id}/register")
    public Event registerUser(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestParam String email) {

        Event updatedEvent = eventService.registerUser(id, userId);

        // Send confirmation email
        emailService.sendRegistrationEmail(email, updatedEvent);


        return updatedEvent;
    }

    @PutMapping("/{id}/unregister")
    public Event unregisterUser(@PathVariable Long id, @RequestParam Long userId) {
        return eventService.unregisterUser(id, userId);
    }
}
