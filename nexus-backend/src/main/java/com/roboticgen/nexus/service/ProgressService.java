package com.roboticgen.nexus.service;

import com.roboticgen.nexus.dto.*;
import com.roboticgen.nexus.exception.ResourceNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import com.roboticgen.nexus.model.Progress;
import com.roboticgen.nexus.model.Task;
import com.roboticgen.nexus.model.User;
import com.roboticgen.nexus.repository.ProgressRepository;
import com.roboticgen.nexus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;

    public ProgressResponse createProgress(ProgressRequest request) {
        User user = getCurrentUser();

        Progress progress = Progress.builder()
            .processName(request.getProcessName())
            .category(request.getCategory())
            .startDate(request.getStartDate())
            .user(user)
            .build();

        // attach tasks
        for (TaskRequest t : request.getTasks()) {
            Task task = Task.builder()
                .name(t.getName())
                .days(t.getDays())
                .completed(false)
                .progress(progress)
                .build();
            progress.getTasks().add(task);
        }

        Progress saved = progressRepository.save(progress);
        return mapToResponse(saved);
    }

     /**
     * Load one Progress by ID (throws if not found or not owned by current user).
     */
    public ProgressResponse getProgressById(Long id) {
        Progress p = progressRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Progress", "id", id));
 
        User me = getCurrentUser();
        if (!p.getUser().getId().equals(me.getId())) {
            throw new AccessDeniedException("You do not have permission to view this resource");
        }
 
        return mapToResponse(p);
    }

    public ProgressResponse updateProgress(Long id, ProgressRequest request) {
                 User me = getCurrentUser();
                 Progress prog = progressRepository.findById(id)
                     .orElseThrow(() -> new ResourceNotFoundException("Progress", "id", id));
         
                 if (!prog.getUser().getId().equals(me.getId())) {
                     throw new AccessDeniedException("Not allowed to edit this");
                 }
         
                 // overwrite fields
                 prog.setProcessName(request.getProcessName());
                 prog.setCategory(request.getCategory());
                 prog.setStartDate(request.getStartDate());
         
                 // rebuild tasks
                 prog.getTasks().clear();
                 for (TaskRequest t : request.getTasks()) {
                     Task task = Task.builder()
                         .name(t.getName())
                         .days(t.getDays())
                         .completed(false)
                         .progress(prog)
                         .build();
                     prog.getTasks().add(task);
                 }
         
                 Progress saved = progressRepository.save(prog);
                 return mapToResponse(saved);
             }
         
             public void deleteProgress(Long id) {
                 User me = getCurrentUser();
                 Progress prog = progressRepository.findById(id)
                     .orElseThrow(() -> new ResourceNotFoundException("Progress", "id", id));
         
                 if (!prog.getUser().getId().equals(me.getId())) {
                     throw new AccessDeniedException("Not allowed to delete this");
                 }
         
                 progressRepository.delete(prog);
             }

    public List<ProgressResponse> getUserProgress() {
        User user = getCurrentUser();
        return progressRepository.findAllByUser(user).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    private ProgressResponse mapToResponse(Progress p) {
    ProgressResponse dto = new ProgressResponse();
    dto.setId(p.getId());
    dto.setProcessName(p.getProcessName());
    dto.setCategory(p.getCategory());
    dto.setStartDate(p.getStartDate());

    // We'll walk a cursor through the calendar
    LocalDate cursor = p.getStartDate();
    LocalDate today  = LocalDate.now();  // or inject Clock for testability

    List<TaskResponse> taskDtos = new ArrayList<>();
    for (Task task : p.getTasks()) {
        TaskResponse tr = new TaskResponse();
        tr.setId(task.getId());
        tr.setName(task.getName());
        tr.setDays(task.getDays());

        // Calculate when this task “ends”
        LocalDate endDate = cursor.plusDays(task.getDays());
        // If today is before endDate → still pending (completed=false)
        // Once today >= endDate → mark completed
        tr.setCompleted(! today.isBefore(endDate));

        taskDtos.add(tr);
        // Advance cursor so next task starts the day after this one ends
        cursor = endDate;
    }

    dto.setTasks(taskDtos);
    return dto;
}

    private User getCurrentUser() {
        String username = ((UserDetails) SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getPrincipal())
            .getUsername();

        return userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }
}
