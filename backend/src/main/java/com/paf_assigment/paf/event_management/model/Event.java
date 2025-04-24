package com.paf_assigment.paf.event_management.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDate eventDate;
    private LocalTime eventTime;

    private String type;     // "Online" or "Physical"
    private String link;     // Only if type == "Online"
    private String location; // Only if type == "Physical"

    private String category;
    private Integer registrationFee;
    private Integer maxParticipants;
    private String instructorName;
    private String instructorBio;
    private Long userId;

    // New field to track registered user IDs
    @ElementCollection
    @CollectionTable(name = "event_registered_users", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "user_id")
    private List<Long> registeredUsers = new ArrayList<>();
}
