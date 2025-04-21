package com.paf_assigment.paf.learning_progress.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.paf_assigment.paf.learning_progress.model.LearningProgressModel;
import com.paf_assigment.paf.learning_progress.repository.LearningProgressRepository;

@Service
public class LearningProgressService {
    private final LearningProgressRepository courseRepo;

    public LearningProgressService(LearningProgressRepository courseRepo) {
        this.courseRepo = courseRepo;
    }

    public LearningProgressModel createCourse(LearningProgressModel course) {
        return courseRepo.save(course);
    }

    public List<LearningProgressModel> getAllCourses() {
        return courseRepo.findAll();
    }

    public LearningProgressModel updateCourse(Long id, LearningProgressModel updatedCourse) {
        return courseRepo.findById(id).map(course -> {
            course.setTitle(updatedCourse.getTitle());
            course.setDescription(updatedCourse.getDescription());
            course.setProgress(updatedCourse.getProgress());
            course.setDeadline(updatedCourse.getDeadline());
            return courseRepo.save(course);
        }).orElse(null);
    }

    public boolean deleteCourse(Long id) {
        if (courseRepo.existsById(id)) {
            courseRepo.deleteById(id);
            return true;
        }
        return false;
    }

    public LearningProgressModel getCourseById(Long id) {
        return courseRepo.findById(id).orElse(null);
    }

    public long getCompletedCoursesCount() {
        return courseRepo.countByProgress(100);
    }

}
