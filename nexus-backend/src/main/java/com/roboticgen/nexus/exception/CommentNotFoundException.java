package com.roboticgen.nexus.exception;

public class CommentNotFoundException extends RuntimeException {
    public CommentNotFoundException(Long id) {
        super("Comment not found: " + id);
    }
}
