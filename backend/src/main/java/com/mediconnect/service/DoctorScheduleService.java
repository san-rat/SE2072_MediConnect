package com.mediconnect.service;

import com.mediconnect.model.DoctorScheduleModel;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public interface DoctorScheduleService {

    // Create default schedule for a doctor (8 AM to 5 PM, Monday to Friday)
    void createDefaultScheduleForDoctor(String doctorId);

    // Create default schedules for all doctors
    void createDefaultSchedulesForAllDoctors();

    // Get schedule for a doctor
    List<DoctorScheduleModel> getScheduleForDoctor(String doctorId);

    // Update doctor schedule
    DoctorScheduleModel updateDoctorSchedule(String scheduleId, LocalTime startTime, LocalTime endTime, boolean isAvailable);

    // Check if doctor is available on a specific day
    boolean isDoctorAvailableOnDay(String doctorId, DayOfWeek dayOfWeek);
}
