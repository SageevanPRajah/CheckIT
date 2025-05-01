package com.roboticgen.nexus.dto;

import lombok.Data;
import java.time.Instant;

@Data
public class CommentResponse {
    private Long id;
    private String content;
    private Long authorId;
    private String authorUsername;
    private Instant createdAt;
    private Instant updatedAt;
}
