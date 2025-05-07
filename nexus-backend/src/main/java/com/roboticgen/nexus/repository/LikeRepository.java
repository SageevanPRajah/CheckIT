package com.roboticgen.nexus.repository;

import com.roboticgen.nexus.model.PostLike;
import com.roboticgen.nexus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<PostLike, Long> {
    boolean existsByPostIdAndUser(Long postId, User user);
    long countByPostId(Long postId);
}
