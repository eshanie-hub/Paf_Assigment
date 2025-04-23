package com.paf_assigment.paf.painting_stats.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class PaintingStatsModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paintingType; // e.g., "Oil", "Watercolor", "Acrylic"
    private int paintingCount; // number of paintings done

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPaintingType() {
        return paintingType;
    }

    public void setPaintingType(String paintingType) {
        this.paintingType = paintingType;
    }

    public int getPaintingCount() {
        return paintingCount;
    }

    public void setPaintingCount(int paintingCount) {
        this.paintingCount = paintingCount;
    }

}
