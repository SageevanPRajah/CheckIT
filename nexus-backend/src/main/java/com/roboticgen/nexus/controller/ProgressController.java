// src/main/java/com/roboticgen/nexus/controller/ProgressController.java
package com.roboticgen.nexus.controller;

import com.roboticgen.nexus.dto.ProgressRequest;
import com.roboticgen.nexus.dto.ProgressResponse;
import com.roboticgen.nexus.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    /**
     * Create a new progress record. Accepts both JSON and form-data.
     */
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ProgressResponse> createProgress(
            @RequestBody ProgressRequest request) {
        return ResponseEntity.ok(progressService.createProgress(request));
    }

    /**
     * List all progress entries for the current user.
     */
    @GetMapping
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<List<ProgressResponse>> getMyProgress() {
        return ResponseEntity.ok(progressService.getUserProgress());
    }
}
