package com.roboticgen.nexus.controller;

import com.roboticgen.nexus.dto.*;
import com.roboticgen.nexus.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService svc;

    @PostMapping
    public ResponseEntity<CommentResponse> create(
        @PathVariable Long postId,
        @RequestBody CommentRequest req
    ) {
        return ResponseEntity.ok(svc.create(postId, req));
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> list(
        @PathVariable Long postId
    ) {
        return ResponseEntity.ok(svc.list(postId));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> update(
        @PathVariable Long postId,
        @PathVariable Long commentId,
        @RequestBody CommentRequest req
    ) {
        return ResponseEntity.ok(svc.update(postId, commentId, req));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(
        @PathVariable Long postId,
        @PathVariable Long commentId
    ) {
        svc.delete(postId, commentId);
        return ResponseEntity.ok().build();
    }
}
