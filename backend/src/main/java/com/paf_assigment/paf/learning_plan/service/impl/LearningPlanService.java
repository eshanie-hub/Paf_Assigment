package com.paf_assigment.paf.learning_plan.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paf_assigment.paf.learning_plan.entity.LearningPlan;
import com.paf_assigment.paf.learning_plan.repository.LearningPlanRepository;

@Service
public class LearningPlanService implements LearningPlanServiceImpl {
    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @Override
    public LearningPlan createLearningPlan(LearningPlan learningPlan) {
        return learningPlanRepository.save(learningPlan);
    }

    @Override
    public LearningPlan getLearningPlanById(Long learningPlanId) {
        return learningPlanRepository.findById(learningPlanId)
                .orElseThrow(() -> new RuntimeException("LearningPlan not found"));
    }

    @Override
    public List<LearningPlan> getAllLearningPlans() {
        return learningPlanRepository.findAll();
    }

    @Override
    public LearningPlan updateLearningPlan(Long learningPlanId, LearningPlan updateLearningPlan) {
        LearningPlan learningPlan = learningPlanRepository.findById(learningPlanId)
                .orElseThrow(() -> new RuntimeException("LearningPlan not found"));
        // learningPlan.setId(updateLearningPlan.getId());
        learningPlan.setTitle(updateLearningPlan.getTitle());
        learningPlan.setDescription(updateLearningPlan.getDescription());
        learningPlan.setDate(updateLearningPlan.getDate());
        learningPlan.setStartTime(updateLearningPlan.getStartTime());
        learningPlan.setEndTime(updateLearningPlan.getEndTime());

        return learningPlanRepository.save(learningPlan);
    }

    @Override
    public void deleteLearningPlan(Long learningPlanId) {
        learningPlanRepository.findById(learningPlanId)
                .orElseThrow(() -> new RuntimeException("LearningPlan not found"));
        learningPlanRepository.deleteById(learningPlanId);
    }
}
