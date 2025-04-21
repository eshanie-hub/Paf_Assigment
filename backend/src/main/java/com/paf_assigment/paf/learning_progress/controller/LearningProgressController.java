package com.paf_assigment.paf.learning_progress.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paf_assigment.paf.learning_progress.model.LearningProgressModel;
import com.paf_assigment.paf.learning_progress.service.LearningProgressService;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class LearningProgressController {
    private final LearningProgressService courseService;

    public LearningProgressController(LearningProgressService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    public LearningProgressModel createCourse(@RequestBody LearningProgressModel course) {
        return courseService.createCourse(course);
    }

    @GetMapping
    public List<LearningProgressModel> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public LearningProgressModel getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    @PutMapping("/{id}")
    public LearningProgressModel updateCourse(@PathVariable Long id, @RequestBody LearningProgressModel course) {
        return courseService.updateCourse(id, course);
    }

    @DeleteMapping("/{id}")
    public boolean deleteCourse(@PathVariable Long id) {
        return courseService.deleteCourse(id);
    }

    @GetMapping("/completed-count")
    public long getCompletedCoursesCount() {
        return courseService.getCompletedCoursesCount();
    }

}
