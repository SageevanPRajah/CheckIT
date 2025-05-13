package com.roboticgen.nexus.repository;

import com.roboticgen.nexus.model.Post;
import com.roboticgen.nexus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByInstructor(User instructor);
}
