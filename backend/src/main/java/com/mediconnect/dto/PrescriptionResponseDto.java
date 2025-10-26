package com.mediconnect.dto;

import java.time.LocalDate;
import java.util.List;

public class PrescriptionResponseDto {
    public Long id;
    public String prescriptionNumber;
    public String doctorName;
    public String facilityName;
    public String patientName;
    public String patientEmail;

    public LocalDate date;
    public LocalDate validUntil;

    public List<PrescriptionCreateDto.MedicationDto> medications;
    public String instructions;
    public String notes;

    public String fileName;
    public String fileType;
    public Long fileSize;
    public String fileUrl; // absolute URL for preview/download
}
