package com.roboticgen.nexus.service;

import com.roboticgen.nexus.dto.CourseRequest;
import com.roboticgen.nexus.dto.CourseResponse;
import com.roboticgen.nexus.exception.CourseNotFoundException;
import com.roboticgen.nexus.model.Course;
import com.roboticgen.nexus.model.User;
import com.roboticgen.nexus.repository.CourseRepository;
import com.roboticgen.nexus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public CourseResponse createCourse(CourseRequest request) {
        User instructor = getCurrentInstructor();

        Course course = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .instructor(instructor)
                .build();

        Course savedCourse = courseRepository.save(course);
        return mapToResponse(savedCourse);
    }

    public List<CourseResponse> getInstructorCourses() {
        User instructor = getCurrentInstructor();
        return courseRepository.findByInstructor(instructor)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CourseResponse getCourse(Long id) {
        Course course = findCourseByIdAndInstructor(id);
        return mapToResponse(course);
    }

    public CourseResponse updateCourse(Long id, CourseRequest request) {
        Course course = findCourseByIdAndInstructor(id);

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());

        Course updatedCourse = courseRepository.save(course);
        return mapToResponse(updatedCourse);
    }

    public void deleteCourse(Long id) {
        Course course = findCourseByIdAndInstructor(id);
        courseRepository.delete(course);
    }

    private Course findCourseByIdAndInstructor(Long id) {
        User instructor = getCurrentInstructor();
        return courseRepository.findById(id)
                .filter(course -> course.getInstructor().equals(instructor))
                .orElseThrow(() -> new CourseNotFoundException(
                        "Course not found with id: " + id));
    }

    private User getCurrentInstructor() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByUsername(username)
                .filter(user -> user.getRole() == User.Role.INSTRUCTOR)
                .orElseThrow(() -> new IllegalStateException(
                        "Current user is not an instructor"));
    }

    private CourseResponse mapToResponse(Course course) {
        CourseResponse response = new CourseResponse();
        response.setId(course.getId());
        response.setTitle(course.getTitle());
        response.setDescription(course.getDescription());
        response.setInstructorId(course.getInstructor().getId());
        response.setInstructorUsername(course.getInstructor().getUsername());
        return response;
    }
}