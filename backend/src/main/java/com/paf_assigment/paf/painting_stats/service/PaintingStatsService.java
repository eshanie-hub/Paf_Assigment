package com.paf_assigment.paf.painting_stats.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.paf_assigment.paf.painting_stats.model.PaintingStatsModel;
import com.paf_assigment.paf.painting_stats.repository.PaintingStatsRepository;

@Service
public class PaintingStatsService {
    private final PaintingStatsRepository repo;

    public PaintingStatsService(PaintingStatsRepository repo) {
        this.repo = repo;
    }

    public PaintingStatsModel createOrUpdate(PaintingStatsModel stat) {
        Optional<PaintingStatsModel> existing = repo.findByPaintingType(stat.getPaintingType());

        if (existing.isPresent()) {
            PaintingStatsModel existingStat = existing.get();

            // Only update the painting count — ignore painting type from request
            existingStat.setPaintingCount(stat.getPaintingCount());
            return repo.save(existingStat);
        } else {
            // For a new entry, paintingType is accepted
            return repo.save(stat);
        }
    }

    public List<PaintingStatsModel> getAllStats() {
        return repo.findAll();
    }

    public boolean deleteStat(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }

    public int getTotalPaintingsCount() {
        return repo.findAll()
                .stream()
                .mapToInt(PaintingStatsModel::getPaintingCount)
                .sum();
    }

}
