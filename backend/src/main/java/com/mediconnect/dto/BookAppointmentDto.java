package com.mediconnect.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

public class BookAppointmentDto {

    @NotNull(message = "Doctor ID is required")
    private String doctorId;

    @NotNull(message = "Appointment date is required")
    private LocalDate appointmentDate;

    @NotNull(message = "Appointment time is required")
    private LocalTime appointmentTime;

    private String notes;

    public BookAppointmentDto() {}

    public BookAppointmentDto(String doctorId, LocalDate appointmentDate, LocalTime appointmentTime, String notes) {
        this.doctorId = doctorId;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.notes = notes;
    }

    // Getters and Setters
    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public LocalTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalTime appointmentTime) { this.appointmentTime = appointmentTime; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
