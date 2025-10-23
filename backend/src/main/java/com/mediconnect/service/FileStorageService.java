package com.mediconnect.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {
    public static final Set<String> PRESCRIPTION_TYPES = Set.of("application/pdf","image/png","image/jpeg");
    public static final Set<String> RECORD_TYPES = Set.of("application/pdf","image/png","image/jpeg","image/gif","image/bmp");
    private final Path base = Paths.get("uploads");

    public FileStorageService() throws IOException {
        Files.createDirectories(base.resolve("prescriptions"));
        Files.createDirectories(base.resolve("medical-records"));
    }

    public StoredFile store(MultipartFile file, String subdir, Set<String> allowedTypes, long maxBytes) throws IOException {
        if (file == null || file.isEmpty()) return null;
        if (!allowedTypes.contains(file.getContentType())) {
            throw new IllegalArgumentException("Unsupported file type: " + file.getContentType());
        }
        if (file.getSize() > maxBytes) {
            throw new IllegalArgumentException("File too large. Max " + maxBytes + " bytes");
        }
        String ext = extractExtension(StringUtils.cleanPath(file.getOriginalFilename()));
        String storedName = UUID.randomUUID() + (ext.isEmpty() ? "" : "." + ext);
        Path target = base.resolve(subdir).resolve(storedName);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return new StoredFile(file.getOriginalFilename(), storedName, file.getContentType(), file.getSize(), subdir);
    }

    public record StoredFile(String originalName, String storedName, String contentType, long size, String subdir) { }

    private String extractExtension(String name) {
        if (name == null) return "";
        int i = name.lastIndexOf('.');
        return (i >= 0 && i < name.length() - 1) ? name.substring(i + 1) : "";
    }
}
