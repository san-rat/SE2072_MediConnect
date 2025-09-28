package com.mediconnect.controller;

import com.mediconnect.dto.PrescriptionResponse;
import com.mediconnect.model.Prescription;
import com.mediconnect.service.FileStorageService;
import com.mediconnect.service.PrescriptionService;
import jakarta.validation.constraints.NotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "${app.frontend.origin}")
public class PrescriptionController {

    private static final Logger logger = LoggerFactory.getLogger(PrescriptionController.class);

    private final PrescriptionService service;
    private final FileStorageService storage;

    public PrescriptionController(PrescriptionService service, FileStorageService storage) {
        this.service = service;
        this.storage = storage;
    }

    // ✅ Doctor uploads a prescription
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("patientId") @NotBlank String patientId,
            @RequestParam("doctorId") @NotBlank String doctorId,
            @RequestParam(value = "notes", required = false) String notes,
            @RequestParam(value = "appointmentId", required = false) String appointmentId
    ) {
        try {
            logger.info("Uploading prescription for patient: {} by doctor: {}", patientId, doctorId);

            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            Prescription prescription = service.uploadPrescription(file, patientId, doctorId, notes, appointmentId);

            PrescriptionResponse response = new PrescriptionResponse(
                    prescription.getId(),
                    prescription.getPatientId(),
                    prescription.getDoctorId(),
                    prescription.getAppointmentId(),
                    prescription.getPrescriptionDate(),
                    prescription.getFileUrl(),
                    prescription.getNotes()
            );

            logger.info("Prescription uploaded successfully with ID: {}", prescription.getId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error uploading prescription", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading prescription: " + e.getMessage());
        }
    }

    // ✅ Get prescriptions by patient
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getByPatient(@PathVariable String patientId) {
        try {
            logger.info("Fetching prescriptions for patient: {}", patientId);
            List<Prescription> prescriptions = service.listByPatient(patientId);

            List<PrescriptionResponse> responses = prescriptions.stream()
                    .map(p -> new PrescriptionResponse(
                            p.getId(),
                            p.getPatientId(),
                            p.getDoctorId(),
                            p.getAppointmentId(),
                            p.getPrescriptionDate(),
                            p.getFileUrl(),
                            p.getNotes()
                    ))
                    .toList();

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            logger.error("Error fetching prescriptions for patient: {}", patientId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching prescriptions: " + e.getMessage());
        }
    }

    // ✅ Get prescriptions by doctor
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getByDoctor(@PathVariable String doctorId) {
        try {
            logger.info("Fetching prescriptions for doctor: {}", doctorId);
            List<Prescription> prescriptions = service.listByDoctor(doctorId);

            List<PrescriptionResponse> responses = prescriptions.stream()
                    .map(p -> new PrescriptionResponse(
                            p.getId(),
                            p.getPatientId(),
                            p.getDoctorId(),
                            p.getAppointmentId(),
                            p.getPrescriptionDate(),
                            p.getFileUrl(),
                            p.getNotes()
                    ))
                    .toList();

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            logger.error("Error fetching prescriptions for doctor: {}", doctorId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching prescriptions: " + e.getMessage());
        }
    }

    // ✅ Download prescription by ID
    @GetMapping("/{id}/download")
    public ResponseEntity<?> download(@PathVariable String id) {
        try {
            Prescription prescription = service.get(id);
            if (prescription == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Prescription not found");
            }

            // Use storage to resolve relative path like "prescriptions/....pdf" under the configured root
            Path filePath = storage.resolve(prescription.getFileUrl());
            if (!Files.exists(filePath)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;

            FileSystemResource resource = new FileSystemResource(filePath.toFile());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + filePath.getFileName().toString() + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (Exception e) {
            logger.error("Error downloading prescription with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error downloading prescription: " + e.getMessage());
        }
    }
}
