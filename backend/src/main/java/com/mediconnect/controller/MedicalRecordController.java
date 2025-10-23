package com.mediconnect.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mediconnect.dto.MedicalRecordCreateDto;
import com.mediconnect.dto.MedicalRecordResponseDto;
import com.mediconnect.service.FileStorageService;
import com.mediconnect.service.MedicalRecordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    private final MedicalRecordService service;
    private final FileStorageService storage;
    private final ObjectMapper mapper;

    public MedicalRecordController(MedicalRecordService service, FileStorageService storage, ObjectMapper mapper) {
        this.service = service;
        this.storage = storage;
        this.mapper = mapper;
    }

    @GetMapping("/patient/my")
    @PreAuthorize("hasRole('PATIENT')")
    public List<MedicalRecordResponseDto> myRecords(Authentication auth) {
        String email = auth.getName();
        return service.getForPatient(email);
    }

    @GetMapping("/doctor/my")
    @PreAuthorize("hasRole('DOCTOR')")
    public List<MedicalRecordResponseDto> doctorRecords(Authentication auth) {

        return service.getForDoctor(resolveUserId(auth));
    }

    @PostMapping(value = "/doctor", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('DOCTOR')")
    public MedicalRecordResponseDto createMultipart(
            Authentication auth,
            @RequestPart("payload") String payloadJson,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment
    ) throws Exception {
        MedicalRecordCreateDto dto = mapper.readValue(payloadJson, MedicalRecordCreateDto.class);
        FileStorageService.StoredFile stored = null;
        if (attachment != null) {
            stored = storage.store(attachment, "medical-records", FileStorageService.RECORD_TYPES, 15 * 1024 * 1024);
        }
        return service.create(resolveUserId(auth), dto, stored);
    }

    @PostMapping(value = "/doctor/json", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('DOCTOR')")
    public MedicalRecordResponseDto createJson(
            Authentication auth,
            @RequestBody MedicalRecordCreateDto dto
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
