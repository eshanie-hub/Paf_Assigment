package com.paf_assigment.paf.learning_plan.service.impl;

import java.util.List;

import com.paf_assigment.paf.learning_plan.entity.LearningPlan;

public interface LearningPlanServiceImpl {
    LearningPlan createLearningPlan(LearningPlan learningPlan);

    LearningPlan getLearningPlanById(Long learningPlanId);

    List<LearningPlan> getAllLearningPlans();

    LearningPlan updateLearningPlan(Long learningPlanId, LearningPlan updateLearningPlan);

    void deleteLearningPlan(Long learningPlanId);
}
