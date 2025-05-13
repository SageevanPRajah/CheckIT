package com.roboticgen.nexus.dto;

import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class PostResponse {
    private Long id;
    private String title;
    private String description;
    private Long instructorId;
    private String instructorUsername;
    private List<String> mediaUrls;
    private Instant createdAt;
    private Instant updatedAt;
    private List<CommentResponse> comments;
    private long likeCount;
}
