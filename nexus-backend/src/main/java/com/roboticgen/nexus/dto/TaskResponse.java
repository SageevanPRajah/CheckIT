package com.roboticgen.nexus.dto;

import lombok.Data;

@Data
public class TaskResponse {
    private Long id;
    private String name;
    private int days;
    private boolean completed;
}
