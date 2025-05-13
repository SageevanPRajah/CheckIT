package com.roboticgen.nexus.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProgressResponse {
    private Long id;
    private String processName;
    private String category;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    private List<TaskResponse> tasks;
}
