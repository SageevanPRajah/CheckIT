package com.roboticgen.nexus.service;

import com.roboticgen.nexus.dto.PostRequest;
import com.roboticgen.nexus.dto.PostResponse;
import com.roboticgen.nexus.exception.PostNotFoundException;
import com.roboticgen.nexus.model.Post;
import com.roboticgen.nexus.model.User;
import com.roboticgen.nexus.repository.PostRepository;
import com.roboticgen.nexus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    // inject your file‐storage component:
    private final FileStorageService fileStorageService;

    public PostResponse createPost(PostRequest request) {
        User instructor = getCurrentInstructor();
        // validate media count/type:
        List<MultipartFile> media = request.getMedia() == null
        ? List.of()
        : request.getMedia();

        // now enforce limits
        if (media.size() > 3)
            throw new IllegalArgumentException("Max 3 images or 1 video");
            List<String> urls = media.stream()
                .map(fileStorageService::store)
                .collect(Collectors.toList());
        

        Post post = Post.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .instructor(instructor)
                .mediaUrls(urls)
                .build();

        Post saved = postRepository.save(post);
        return mapToResponse(saved);
    }

    public List<PostResponse> getInstructorPosts() {
        User inst = getCurrentInstructor();
        return postRepository.findByInstructor(inst).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PostResponse getPost(Long id) {
        return mapToResponse(postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(id)));
    }

    public PostResponse updatePost(Long id, PostRequest request) {
        Post existing = postRepository.findById(id)
            .orElseThrow(() -> new PostNotFoundException(id));
    
        List<MultipartFile> media = request.getMedia() == null
            ? List.of()
            : request.getMedia();
    
        if (!media.isEmpty()) {
            if (media.size() > 3)
                throw new IllegalArgumentException("Max 3 images or 1 video");
            List<String> urls = media.stream()
                .map(fileStorageService::store)
                .collect(Collectors.toList());
            existing.setMediaUrls(urls);
        }
        existing.setTitle(request.getTitle());
        existing.setDescription(request.getDescription());
        Post updated = postRepository.save(existing);
        return mapToResponse(updated);
    }
    

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    private User getCurrentInstructor() {
        String username = SecurityContextHolder.getContext()
            .getAuthentication().getName();
        return userRepository.findByUsername(username).stream()
                .filter(u -> u.getRole() == User.Role.INSTRUCTOR)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException(
                    "Current user is not an instructor"));
    }

    private PostResponse mapToResponse(Post post) {
        PostResponse r = new PostResponse();
        r.setId(post.getId());
        r.setTitle(post.getTitle());
        r.setDescription(post.getDescription());
        r.setInstructorId(post.getInstructor().getId());
        r.setInstructorUsername(post.getInstructor().getUsername());
        r.setMediaUrls(post.getMediaUrls());
        return r;
    }
}
