package com.roboticgen.nexus.dto;

import lombok.Data;
import java.util.List;

@Data
public class PostResponse {
    private Long id;
    private String title;
    private String description;
    private Long instructorId;
    private String instructorUsername;
    private List<String> mediaUrls;
}
