package com.roboticgen.nexus.controller;

import com.roboticgen.nexus.dto.UserDto;
import com.roboticgen.nexus.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// src/main/java/com/roboticgen/nexus/controller/PublicUserController.java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class PublicUserController {
  private final UserService userService;

  @GetMapping
  public List<UserDto> listAll() {
    return userService.getAllUsers().stream()
      .map(u -> new UserDto(u.getId(), u.getUsername()))
      .toList();
  }
}
