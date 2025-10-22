package com.mediconnect.dto;

import java.time.LocalDate;

public class MedicalRecordResponseDto {
    public Long id;
    public String recordNumber;
    public String doctorName;
    public String facilityName;
    public String patientName;
    public String patientEmail;

    public LocalDate date;
    public String summary;

    public String fileName;
    public String fileType;
    public Long fileSize;
    public String fileUrl;
}
