package com.paf_assigment.paf.event_management.repository;

import com.paf_assigment.paf.event_management.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
    // You can add custom query methods later if needed
}