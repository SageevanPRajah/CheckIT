package com.roboticgen.nexus.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    /**
     * Store the given file (image or video) and return its publicly-reachable URL.
     */
    String store(MultipartFile file);
}
