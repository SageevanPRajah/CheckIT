package com.roboticgen.nexus.controller;

import com.roboticgen.nexus.dto.PostRequest;
import com.roboticgen.nexus.dto.PostResponse;
import com.roboticgen.nexus.service.PostService;
import lombok.RequiredArgsConstructor;

import com.roboticgen.nexus.model.User;
import com.roboticgen.nexus.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final UserRepository userRepository;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<PostResponse> createPost(
            @RequestParam String title,
            @RequestParam String description,
            @RequestPart(name = "media", required = false) List<MultipartFile> media) {
        PostRequest req = new PostRequest();
        req.setTitle(title);
        req.setDescription(description);
        // if nobody sent a media part, just use empty list
        req.setMedia(media == null ? List.of() : media);
        return ResponseEntity.ok(postService.createPost(req));
    }

    @GetMapping
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<List<PostResponse>> getInstructorPosts() {
        return ResponseEntity.ok(postService.getInstructorPosts());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<PostResponse> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPost(id));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam String description,
            @RequestPart(name = "media", required = false) List<MultipartFile> media) {
        PostRequest req = new PostRequest();
        req.setTitle(title);
        req.setDescription(description);
        if (media != null) req.setMedia(media);
        return ResponseEntity.ok(postService.updatePost(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Public feed: returns every post in the system,
     * with its comments and current like‐count.
     */
    @GetMapping("/feed")
    public ResponseEntity<List<PostResponse>> getFeed() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    /**
     * Like a post.
     */
    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likePost(@PathVariable Long id) {
        postService.likePost(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<PostResponse>> getPostsByUsername(@PathVariable String username) {
        User user = userRepository
            .findByUsernameIgnoreCase(username)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "No such user: " + username
            ));

        List<PostResponse> all = postService.getAllPosts();
        List<PostResponse> filtered = all.stream()
            .filter(p -> p.getInstructorId().equals(user.getId()))
            .collect(Collectors.toList());

        return ResponseEntity.ok(filtered);
    }
}
