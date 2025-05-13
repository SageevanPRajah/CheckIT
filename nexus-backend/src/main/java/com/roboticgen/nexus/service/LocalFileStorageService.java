package com.roboticgen.nexus.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;

@Service
public class LocalFileStorageService implements FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public String store(MultipartFile file) {
        try {
            // ensure upload directory exists
            Path uploads = Paths.get(uploadDir);
            if (!Files.exists(uploads)) {
                Files.createDirectories(uploads);
            }

            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path target = uploads.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            // return a URL or path that your controller can expose
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + file.getOriginalFilename(), e);
        }
    }
}
