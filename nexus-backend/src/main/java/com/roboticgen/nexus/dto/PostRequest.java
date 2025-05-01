package com.roboticgen.nexus.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Data
public class PostRequest {
    private String title;
    private String description;
    // accept up to 3 images or one video (max 30s)—we’ll validate later
    private List<MultipartFile> media;
}
