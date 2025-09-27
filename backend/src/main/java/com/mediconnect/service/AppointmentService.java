package com.mediconnect.service;

import java.time.LocalDate;
import java.util.List;

import com.mediconnect.dto.AppointmentResponseDto;
import com.mediconnect.dto.BookAppointmentDto;
import com.mediconnect.model.AppointmentModel;

public interface AppointmentService {

    // Book a new appointment
    AppointmentResponseDto bookAppointment(BookAppointmentDto bookAppointmentDto, String patientId);

    // Book a new appointment by user email
    AppointmentResponseDto bookAppointmentByEmail(BookAppointmentDto bookAppointmentDto, String userEmail);

    // Get appointments by patient
    List<AppointmentResponseDto> getAppointmentsByPatient(String patientId);

    // Get upcoming appointments for patient
    List<AppointmentResponseDto> getUpcomingAppointmentsByPatient(String userId);

    // Get upcoming appointments for patient by email
    List<AppointmentResponseDto> getUpcomingAppointmentsByPatientEmail(String userEmail);

    // Get past appointments for patient
    List<AppointmentResponseDto> getPastAppointmentsByPatient(String userId);

    // Get past appointments for patient by email
    List<AppointmentResponseDto> getPastAppointmentsByPatientEmail(String userEmail);

    // Get appointments by doctor
    List<AppointmentResponseDto> getAppointmentsByDoctor(String doctorId);

    // Get appointment by ID
    AppointmentResponseDto getAppointmentById(String appointmentId);

    // Update appointment status
    AppointmentResponseDto updateAppointmentStatus(String appointmentId, AppointmentModel.AppointmentStatus status);

    // Cancel appointment
    AppointmentResponseDto cancelAppointment(String appointmentId);

    // Check appointment availability
    boolean isAppointmentAvailable(String doctorId, LocalDate date, String time);

    // Get appointment statistics
    long getAppointmentCountByStatus(AppointmentModel.AppointmentStatus status);
}
