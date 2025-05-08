package com.paf_assigment.paf.painting_stats.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paf_assigment.paf.painting_stats.model.PaintingStatsModel;
import com.paf_assigment.paf.painting_stats.service.PaintingStatsService;

@RestController
@RequestMapping("/api/painting-stats")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")

public class PaintingStatsController {
    private final PaintingStatsService service;

    public PaintingStatsController(PaintingStatsService service) {
        this.service = service;
    }

    @PostMapping
    public PaintingStatsModel createOrUpdate(@RequestBody PaintingStatsModel stat) {
        return service.createOrUpdate(stat);
    }

    @GetMapping
    public List<PaintingStatsModel> getAllStats() {
        return service.getAllStats();
    }

    @DeleteMapping("/{id}")
    public boolean deleteStat(@PathVariable Long id) {
        return service.deleteStat(id);
    }

    @GetMapping("/total")
    public int getTotalPaintingCount() {
        return service.getTotalPaintingsCount();
    }

}
