package com.mediconnect.service;

import com.mediconnect.dto.MedicalRecordCreateDto;
import com.mediconnect.dto.MedicalRecordResponseDto;

import java.util.List;

public interface MedicalRecordService {
    List<MedicalRecordResponseDto> getForPatient(String patientEmail);
    List<MedicalRecordResponseDto> getForDoctor(String doctorUserId);
    MedicalRecordResponseDto create(String doctorUserId, MedicalRecordCreateDto dto, FileStorageService.StoredFile stored);
}
