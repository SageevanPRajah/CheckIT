package com.roboticgen.nexus.repository;

import com.roboticgen.nexus.model.Progress;
import com.roboticgen.nexus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findAllByUser(User user);
}
