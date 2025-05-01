package com.roboticgen.nexus.repository;

import com.roboticgen.nexus.model.Course;
import com.roboticgen.nexus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByInstructor(User instructor);
}