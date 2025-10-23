package com.mediconnect.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mediconnect.dto.PrescriptionCreateDto;
import com.mediconnect.dto.PrescriptionResponseDto;
import com.mediconnect.service.FileStorageService;
import com.mediconnect.service.PrescriptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService service;
    private final FileStorageService storage;
    private final ObjectMapper mapper;

    public PrescriptionController(PrescriptionService service, FileStorageService storage, ObjectMapper mapper) {
        this.service = service;
        this.storage = storage;
        this.mapper = mapper;
    }

    // Patient: my prescriptions
    @GetMapping("/patient/my")
    @PreAuthorize("hasRole('PATIENT')")
    public List<PrescriptionResponseDto> myPrescriptions(Authentication auth) {
        String email = auth.getName(); // assuming username is email
        return service.getForPatient(email);
    }

    // Doctor: my issued prescriptions
    @GetMapping("/doctor/my")
    @PreAuthorize("hasRole('DOCTOR')")
    public List<PrescriptionResponseDto> doctorPrescriptions(Authentication auth) {
        return service.getForDoctor(resolveUserId(auth));
    }

    // Doctor: create (supports JSON or multipart with "payload" + "attachment")
    @PostMapping(value = "/doctor", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('DOCTOR')")
    public PrescriptionResponseDto createMultipart(
            Authentication auth,
            @RequestPart("payload") String payloadJson,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment
    ) throws Exception {
        PrescriptionCreateDto dto = mapper.readValue(payloadJson, PrescriptionCreateDto.class);
        FileStorageService.StoredFile stored = null;
        if (attachment != null) {
            stored = storage.store(attachment, "prescriptions", FileStorageService.PRESCRIPTION_TYPES, 10 * 1024 * 1024);
        }
        return service.create(resolveUserId(auth), dto, stored);
    }

    @PostMapping(value = "/doctor/json", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('DOCTOR')")
    public PrescriptionResponseDto createJson(
            Authentication auth,
            @RequestBody PrescriptionCreateDto dto
    ) {
        return service.create(resolveUserId(auth), dto, null);
    }

    private String resolveUserId(Authentication auth) {
        // If your CustomUserDetails stores userId as a string in the principal or details:
        try {
            Object principal = auth.getPrincipal();
            if (principal instanceof String) {
                return (String) principal;
            }
            // If your authentication name is the userId/email
            return auth.getName();
        } catch (Exception e) {
            // Fallback: just return auth.getName() (usually username or email)
            return auth.getName();
        }
    }

}
