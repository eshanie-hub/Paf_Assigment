package com.paf_assigment.paf.learning_plan.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paf_assigment.paf.learning_plan.entity.LearningPlan;

public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {

}
