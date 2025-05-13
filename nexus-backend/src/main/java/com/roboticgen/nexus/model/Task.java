package com.roboticgen.nexus.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "days", nullable = false)
    private int days;

    @Column(name = "completed", nullable = false)
    private boolean completed;

    @ManyToOne
    @JoinColumn(name = "progress_id", nullable = false)
    private Progress progress;
}
