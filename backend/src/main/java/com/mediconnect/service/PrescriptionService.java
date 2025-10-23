package com.mediconnect.service;

import com.mediconnect.dto.PrescriptionCreateDto;
import com.mediconnect.dto.PrescriptionResponseDto;

import java.util.List;

public interface PrescriptionService {
    List<PrescriptionResponseDto> getForPatient(String patientEmail);
    List<PrescriptionResponseDto> getForDoctor(String doctorUserId);
    PrescriptionResponseDto create(String doctorUserId, PrescriptionCreateDto dto, FileStorageService.StoredFile stored);
}
