package com.roboticgen.nexus.service;

import com.roboticgen.nexus.exception.UserNotFoundException;
import com.roboticgen.nexus.model.User;
import com.roboticgen.nexus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            throw new UserNotFoundException("No users found in the system.");
        }
        return users;
    }
}
