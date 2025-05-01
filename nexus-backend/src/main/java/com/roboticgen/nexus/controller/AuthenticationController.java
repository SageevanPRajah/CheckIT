package com.roboticgen.nexus.controller;

import com.roboticgen.nexus.dto.*;
import com.roboticgen.nexus.model.User;
import com.roboticgen.nexus.repository.UserRepository;
import com.roboticgen.nexus.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private static final Logger LOGGER = Logger.getLogger(AuthenticationController.class.getName());

    private final UserRepository userRepository;

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            LOGGER.info("Fetching user details for username: " + username);
            if (username == null || username.equals("anonymousUser")) {
                LOGGER.warning("No authenticated user found.");
                return ResponseEntity.status(401).body(null); // Unauthorized
            }
            User user = userRepository.findByUsernameIgnoreCase(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));
            LOGGER.info("User found: " + user.getUsername());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            LOGGER.severe("Error fetching user details: " + e.getMessage());
            return ResponseEntity.status(500).body(null); // Internal Server Error
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(service.refreshToken(request.getRefreshToken()));
    }

    @PostMapping("/exists")
    public ResponseEntity<Boolean> checkUserExists(
            @RequestBody UserExistsRequest request) {
        boolean exists = service.userExists(request.getId(), request.getUsername(), request.getRole());
        return ResponseEntity.ok(exists);
    }

    @PutMapping("/updatePassword")
    public ResponseEntity<Void> updatePassword(
            @RequestBody UpdatePasswordRequest request) {
        service.updatePassword(request.getUsername(), request.getPassword());
        return ResponseEntity.ok().build();
    }

}
