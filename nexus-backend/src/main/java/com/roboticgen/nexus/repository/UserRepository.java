package com.roboticgen.nexus.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.roboticgen.nexus.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    @Query("SELECT u FROM User u WHERE LOWER(u.username) = LOWER(:username)")
    Optional<User> findByUsernameIgnoreCase(@Param("username") String username);

    Optional<User> findByEmail(String email);

    boolean existsByIdAndUsernameAndRole(Long id, String username, User.Role role);


}