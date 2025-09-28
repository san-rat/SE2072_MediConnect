package com.mediconnect.service;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);

    private final Path rootDir;
    private final String prescriptionsDirName;

    public FileStorageService(
            @Value("${mediconnect.upload.root}") String root,
            @Value("${mediconnect.upload.prescriptions-dir}") String prescriptionsDirName
    ) {
        this.rootDir = Paths.get(root).toAbsolutePath().normalize();
        this.prescriptionsDirName = prescriptionsDirName;
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(this.rootDir);
            Files.createDirectories(this.rootDir.resolve(prescriptionsDirName));
            logger.info("Upload directories created successfully at: {}", this.rootDir);
        } catch (IOException ex) {
            logger.error("Failed to create upload directories", ex);
            throw new RuntimeException("Failed to create upload directories", ex);
        }
    }

    public String storePrescription(MultipartFile file) {
        return storeFile(file, prescriptionsDirName);
    }

    public String storePrescriptionFile(MultipartFile file, String patientId, String doctorId) {
        // ✅ add patient/doctor info into filename for clarity
        String prefix = patientId + "_" + doctorId + "_";
        return storeFile(file, prescriptionsDirName, prefix);
    }

    private String storeFile(MultipartFile file, String subDir) {
        return storeFile(file, subDir, "");
    }

    private String storeFile(MultipartFile file, String subDir, String prefix) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Cannot store empty file");
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.trim().isEmpty()) {
                throw new RuntimeException("Invalid filename");
            }

            String cleanFilename = StringUtils.cleanPath(originalFilename);
            String safeFilename = cleanFilename.replaceAll("\\s+", "_");
            String uniqueFilename = prefix + UUID.randomUUID() + "_" + safeFilename;

            Path targetPath = rootDir.resolve(subDir).resolve(uniqueFilename);

            // Security check
            if (!targetPath.getParent().equals(rootDir.resolve(subDir))) {
                throw new RuntimeException("Invalid file path");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }

            String relativePath = subDir + "/" + uniqueFilename;
            logger.info("File stored successfully: {}", relativePath);
            return relativePath;

        } catch (IOException ex) {
            logger.error("Failed to store file: {}", file.getOriginalFilename(), ex);
            throw new RuntimeException("Failed to store file", ex);
        }
    }

    public Path resolve(String relativePath) {
        try {
            Path resolvedPath = rootDir.resolve(relativePath).normalize();

            if (!resolvedPath.startsWith(rootDir)) {
                throw new RuntimeException("Invalid file path");
            }

            return resolvedPath;
        } catch (Exception ex) {
            logger.error("Failed to resolve path: {}", relativePath, ex);
            throw new RuntimeException("Failed to resolve file path", ex);
        }
    }

    public boolean fileExists(String relativePath) {
        try {
            Path path = resolve(relativePath);
            return Files.exists(path) && Files.isRegularFile(path);
        } catch (Exception ex) {
            logger.error("Error checking file existence: {}", relativePath, ex);
            return false;
        }
    }
}
