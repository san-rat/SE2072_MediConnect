package com.mediconnect.dto;

import java.time.LocalDate;
import java.util.List;

public class PrescriptionCreateDto {
    public String prescriptionNumber;
    public String patientEmail;   // or patientId if you prefer
    public String patientName;    // for echo in response
    public LocalDate date;
    public LocalDate validUntil;
    public String instructions;
    public String notes;
    public String facilityName;

    public List<MedicationDto> medications;

    public static class MedicationDto {
        public String name;
        public String dosage;
        public String frequency;
        public String duration;
    }
}
