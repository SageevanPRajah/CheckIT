package com.roboticgen.nexus.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProgressRequest {
    private String processName;
    private String category;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    private List<TaskRequest> tasks;
}
