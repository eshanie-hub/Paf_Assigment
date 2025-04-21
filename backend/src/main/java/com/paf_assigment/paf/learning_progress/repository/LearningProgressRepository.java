package com.paf_assigment.paf.learning_progress.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paf_assigment.paf.learning_progress.model.LearningProgressModel;

public interface LearningProgressRepository extends JpaRepository<LearningProgressModel, Long> {
    long countByProgress(int progress);

}
