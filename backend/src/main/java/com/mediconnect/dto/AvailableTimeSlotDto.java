package com.mediconnect.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class AvailableTimeSlotDto {

    private String id;
    private String doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private Double consultationFee;
    private LocalDate slotDate;
    private LocalTime startTime;
    private LocalTime endTime;

    public AvailableTimeSlotDto() {}

    public AvailableTimeSlotDto(String id, String doctorId, String doctorName, String doctorSpecialization, 
                               Double consultationFee, LocalDate slotDate, LocalTime startTime, LocalTime endTime) {
        this.id = id;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.doctorSpecialization = doctorSpecialization;
        this.consultationFee = consultationFee;
        this.slotDate = slotDate;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getDoctorSpecialization() { return doctorSpecialization; }
    public void setDoctorSpecialization(String doctorSpecialization) { this.doctorSpecialization = doctorSpecialization; }

    public Double getConsultationFee() { return consultationFee; }
    public void setConsultationFee(Double consultationFee) { this.consultationFee = consultationFee; }

    public LocalDate getSlotDate() { return slotDate; }
    public void setSlotDate(LocalDate slotDate) { this.slotDate = slotDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
}
