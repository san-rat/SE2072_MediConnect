package com.mediconnect.dto;

import java.time.LocalDate;

public class MedicalRecordCreateDto {
    public String recordNumber;
    public String patientEmail;
    public String patientName;
    public LocalDate date;
    public String summary;
    public String facilityName;
}
