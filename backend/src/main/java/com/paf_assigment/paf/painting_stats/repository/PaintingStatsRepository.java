package com.paf_assigment.paf.painting_stats.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paf_assigment.paf.painting_stats.model.PaintingStatsModel;

public interface PaintingStatsRepository extends JpaRepository<PaintingStatsModel, Long> {
    Optional<PaintingStatsModel> findByPaintingType(String paintingType);

}
