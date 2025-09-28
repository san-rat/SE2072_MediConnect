package com.mediconnect.service;

import com.mediconnect.dto.AvailableTimeSlotDto;

import java.time.LocalDate;
import java.util.List;

public interface TimeSlotService {

    // Generate time slots for a doctor for a specific date range
    void generateTimeSlotsForDoctor(String doctorId, LocalDate startDate, LocalDate endDate);

    // Generate time slots for all doctors for a specific date range
    void generateTimeSlotsForAllDoctors(LocalDate startDate, LocalDate endDate);

    // Get available time slots for a doctor on a specific date
    List<AvailableTimeSlotDto> getAvailableTimeSlotsForDoctor(String doctorId, LocalDate date);

    // Get available time slots for a doctor in a date range
    List<AvailableTimeSlotDto> getAvailableTimeSlotsForDoctor(String doctorId, LocalDate startDate, LocalDate endDate);

    // Get available time slots by specialization on a specific date
    List<AvailableTimeSlotDto> getAvailableTimeSlotsBySpecialization(String specialization, LocalDate date);

    // Get available time slots for all doctors on a specific date
    List<AvailableTimeSlotDto> getAvailableTimeSlotsForDate(LocalDate date);

    // Get available time slots for all doctors in a date range
    List<AvailableTimeSlotDto> getAvailableTimeSlotsForDateRange(LocalDate startDate, LocalDate endDate);

    // Check if a specific time slot is available
    boolean isTimeSlotAvailable(String doctorId, LocalDate date, String time);

    // Mark time slot as booked
    void markTimeSlotAsBooked(String doctorId, LocalDate date, String time);

    // Mark time slot as available
    void markTimeSlotAsAvailable(String doctorId, LocalDate date, String time);
    
    long getTotalTimeSlotsCount();
}
