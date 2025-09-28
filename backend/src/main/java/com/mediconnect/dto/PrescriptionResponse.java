package com.mediconnect.dto;

import java.time.Instant;

public class PrescriptionResponse {
    public String id;
    public String patientId;
    public String doctorId;
    public String appointmentId;
    public Instant prescriptionDate;
    public String fileUrl;
    public String notes;

    public PrescriptionResponse(String id, String patientId, String doctorId, String appointmentId,
                                Instant prescriptionDate, String fileUrl, String notes) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.appointmentId = appointmentId;
        this.prescriptionDate = prescriptionDate;
        this.fileUrl = fileUrl;
        this.notes = notes;
    }
}
// inside PrescriptionRepository.java

