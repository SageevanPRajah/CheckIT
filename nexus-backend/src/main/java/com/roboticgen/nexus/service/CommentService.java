package com.roboticgen.nexus.service;

import com.roboticgen.nexus.dto.*;
import com.roboticgen.nexus.exception.*;
import com.roboticgen.nexus.model.*;
import com.roboticgen.nexus.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepo;
    private final PostRepository postRepo;
    private final UserRepository userRepo;

    public CommentResponse create(Long postId, CommentRequest req) {
        Post post = postRepo.findById(postId)
            .orElseThrow(() -> new PostNotFoundException(postId));
        User user = getCurrentUser();
        Comment c = Comment.builder()
            .content(req.getContent())
            .post(post)
            .author(user)
            .build();
        Comment saved = commentRepo.save(c);
        return toDto(saved);
    }

    public List<CommentResponse> list(Long postId) {
        Post post = postRepo.findById(postId)
            .orElseThrow(() -> new PostNotFoundException(postId));
        return commentRepo.findByPostOrderByCreatedAtAsc(post)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public CommentResponse update(Long postId, Long commentId, CommentRequest req) {
        Comment c = commentRepo.findById(commentId)
            .filter(cm -> cm.getPost().getId().equals(postId))
            .orElseThrow(() -> new CommentNotFoundException(commentId));
        User me = getCurrentUser();
        if (!c.getAuthor().getId().equals(me.getId())) {
            throw new IllegalStateException("Not comment author");
        }
        c.setContent(req.getContent());
        return toDto(commentRepo.save(c));
    }

    public void delete(Long postId, Long commentId) {
        Comment c = commentRepo.findById(commentId)
            .filter(cm -> cm.getPost().getId().equals(postId))
            .orElseThrow(() -> new CommentNotFoundException(commentId));
        User me = getCurrentUser();
        boolean isAuthor = c.getAuthor().getId().equals(me.getId());
        boolean isPostOwner = c.getPost().getInstructor().getId().equals(me.getId());
        if (!isAuthor && !isPostOwner) {
            throw new IllegalStateException("Not allowed to delete");
        }
        commentRepo.delete(c);
    }

    private User getCurrentUser() {
        String u = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByUsername(u).stream().findFirst()
            .orElseThrow(() -> new IllegalStateException("No user"));
    }

    private CommentResponse toDto(Comment c) {
        CommentResponse r = new CommentResponse();
        r.setId(c.getId());
        r.setContent(c.getContent());
        r.setAuthorId(c.getAuthor().getId());
        r.setAuthorUsername(c.getAuthor().getUsername());
        r.setCreatedAt(c.getCreatedAt());
        r.setUpdatedAt(c.getUpdatedAt());
        return r;
    }
}
