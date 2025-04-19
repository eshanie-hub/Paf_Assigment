package com.paf_assigment.paf.learning_plan.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paf_assigment.paf.learning_plan.entity.LearningPlan;
import com.paf_assigment.paf.learning_plan.service.impl.LearningPlanService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/learningPlan")
public class LearningPlanController {
    @Autowired
    private LearningPlanService learningPlanService;

    @PostMapping
    public ResponseEntity<LearningPlan> createLearningPlan(@RequestBody LearningPlan learningPlan) {
        LearningPlan savedPlan = learningPlanService.createLearningPlan(learningPlan);
        return new ResponseEntity<>(savedPlan, HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<LearningPlan> getLearningPlanById(@PathVariable("id") Long learningPlanId) {
        LearningPlan learningPlan = learningPlanService.getLearningPlanById(learningPlanId);
        return ResponseEntity.ok(learningPlan);
    }

    @GetMapping
    public ResponseEntity<List<LearningPlan>> getAllLearningPlans() {
        List<LearningPlan> learningPlans = learningPlanService.getAllLearningPlans();
        return ResponseEntity.ok(learningPlans);
    }

    @PutMapping("{id}")
    public ResponseEntity<LearningPlan> updateLearningPlan(@PathVariable("id") Long learningPlanId,
            @RequestBody LearningPlan updateLearningPlan) {
        LearningPlan learningPlan = learningPlanService.updateLearningPlan(learningPlanId, updateLearningPlan);
        return ResponseEntity.ok(learningPlan);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteLearningPlan(@PathVariable("id") Long learningPlanId) {
        learningPlanService.deleteLearningPlan(learningPlanId);
        return ResponseEntity.ok("Learning Plan deleted succeefully!");
    }
}
