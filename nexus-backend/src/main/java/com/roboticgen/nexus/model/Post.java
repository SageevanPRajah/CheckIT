package com.roboticgen.nexus.model;

import lombok.*;
import jakarta.persistence.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // link back to the creator (instructor)
    @ManyToOne
    @JoinColumn(name = "instructor_id", nullable = false)
    private User instructor;

    // store URLs of uploaded media
    @ElementCollection
    @CollectionTable(
      name = "post_media",
      joinColumns = @JoinColumn(name = "post_id")
    )
    @Column(name = "media_url")
    private List<String> mediaUrls;
}
