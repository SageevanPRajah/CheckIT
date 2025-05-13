package com.roboticgen.nexus.dto;

import lombok.Data;

@Data
public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private Long instructorId;
    private String instructorUsername;
}