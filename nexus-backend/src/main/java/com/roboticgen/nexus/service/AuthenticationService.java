package com.roboticgen.nexus.service;

import com.roboticgen.nexus.dto.AuthenticationRequest;
import com.roboticgen.nexus.dto.AuthenticationResponse;
import com.roboticgen.nexus.dto.RegisterRequest;
import com.roboticgen.nexus.model.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.roboticgen.nexus.config.JwtService;
import com.roboticgen.nexus.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
  private final UserRepository repository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public AuthenticationResponse register(RegisterRequest request) {
    var user = User.builder()
        .username(request.getUsername())
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))
        .role(request.getRole())
        .phoneNumber(request.getPhoneNumber())
        .build();
    
    repository.save(user);

    var accessToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user); // Generate refresh token

    return AuthenticationResponse.builder()
        .accessToken(accessToken)
        .refreshToken(refreshToken)
        .build();
  }

  public AuthenticationResponse refreshToken(String refreshToken) {
    String username = jwtService.extractUsername(refreshToken); 
    var user = repository.findByUsername(username) // Retrieve user from DB
        .orElseThrow(() -> new RuntimeException("User not found"));

    if (!jwtService.validateToken(refreshToken, user)) {
        throw new RuntimeException("Invalid refresh token");
    }

    var newAccessToken = jwtService.generateToken(user);
    var newRefreshToken = jwtService.generateRefreshToken(user);

    return AuthenticationResponse.builder()
            .accessToken(newAccessToken)
            .refreshToken(newRefreshToken)
            .build();
}


  public AuthenticationResponse authenticate(AuthenticationRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getUsername(),
            request.getPassword()));
    var user = repository.findByUsername(request.getUsername())
        .orElseThrow();

    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user); // Generate refresh token


    return AuthenticationResponse.builder()
        .accessToken(jwtToken)
        .refreshToken(refreshToken)
        .build();
  }

  public boolean userExists(Long id, String username, User.Role role) {
        return repository.existsByIdAndUsernameAndRole(id, username, role);
  }

  public void updatePassword(String username, String password) {
    var user = repository.findByUsername(username);
    user.ifPresent(u -> {
      u.setPassword(passwordEncoder.encode(password));
      repository.save(u);
    });
  }


}
