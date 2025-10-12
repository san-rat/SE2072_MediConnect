package com.mediconnect.service;

import com.mediconnect.dto.AvailableTimeSlotDto;
import com.mediconnect.model.*;
import com.mediconnect.repository.*;
import com.mediconnect.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TimeSlotServiceImpl implements TimeSlotService {

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorScheduleRepository doctorScheduleRepository;

    @Override
    public void generateTimeSlotsForDoctor(String doctorId, LocalDate startDate, LocalDate endDate) {
        DoctorModel doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            generateTimeSlotsForDoctorOnDate(doctor, currentDate);
            currentDate = currentDate.plusDays(1);
        }
    }

    @Override
    public void generateTimeSlotsForAllDoctors(LocalDate startDate, LocalDate endDate) {
        List<DoctorModel> doctors = doctorRepository.findAll();
        for (DoctorModel doctor : doctors) {
            generateTimeSlotsForDoctor(doctor.getId(), startDate, endDate);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AvailableTimeSlotDto> getAvailableTimeSlotsForDoctor(String doctorId, LocalDate date) {
        DoctorModel doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        List<TimeSlotModel> timeSlots = timeSlotRepository.findByDoctorAndSlotDateAndIsAvailableTrueAndIsBookedFalseOrderByStartTime(doctor, date);
        
        List<AvailableTimeSlotDto> result = timeSlots.stream()
                .map(this::convertToAvailableTimeSlotDto)
                .collect(Collectors.toList());
        
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AvailableTimeSlotDto> getAvailableTimeSlotsForDoctor(String doctorId, LocalDate startDate, LocalDate endDate) {
        DoctorModel doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        List<TimeSlotModel> timeSlots = timeSlotRepository.findAvailableByDoctorAndDateRange(doctor, startDate, endDate);
        return timeSlots.stream()
                .map(this::convertToAvailableTimeSlotDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AvailableTimeSlotDto> getAvailableTimeSlotsBySpecialization(String specialization, LocalDate date) {
        List<TimeSlotModel> timeSlots = timeSlotRepository.findAvailableBySpecializationAndDate(specialization, date);
        return timeSlots.stream()
                .map(this::convertToAvailableTimeSlotDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AvailableTimeSlotDto> getAvailableTimeSlotsForDate(LocalDate date) {
        List<TimeSlotModel> timeSlots = timeSlotRepository.findBySlotDateAndIsAvailableTrueAndIsBookedFalseOrderByStartTime(date);
        return timeSlots.stream()
                .map(this::convertToAvailableTimeSlotDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AvailableTimeSlotDto> getAvailableTimeSlotsForDateRange(LocalDate startDate, LocalDate endDate) {
        List<TimeSlotModel> timeSlots = timeSlotRepository.findAvailableByDateRange(startDate, endDate);
        return timeSlots.stream()
                .map(this::convertToAvailableTimeSlotDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isTimeSlotAvailable(String doctorId, LocalDate date, String time) {
        DoctorModel doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        LocalTime appointmentTime = LocalTime.parse(time);
        return timeSlotRepository.existsAvailableSlot(doctor, date, appointmentTime);
    }

    @Override
    public void markTimeSlotAsBooked(String doctorId, LocalDate date, String time) {
        DoctorModel doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        LocalTime appointmentTime = LocalTime.parse(time);
        TimeSlotModel timeSlot = timeSlotRepository.findByDoctorAndSlotDateAndStartTime(doctor, date, appointmentTime)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", "id", "not found"));

        timeSlot.setIsBooked(true);
        timeSlotRepository.save(timeSlot);
    }

    @Override
    public void markTimeSlotAsAvailable(String doctorId, LocalDate date, String time) {
        DoctorModel doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        LocalTime appointmentTime = LocalTime.parse(time);
        TimeSlotModel timeSlot = timeSlotRepository.findByDoctorAndSlotDateAndStartTime(doctor, date, appointmentTime)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", "id", "not found"));

        timeSlot.setIsBooked(false);
        timeSlotRepository.save(timeSlot);
    }

    @Override
    @Transactional(readOnly = true)
    public long getTotalTimeSlotsCount() {
        return timeSlotRepository.count();
    }

    private void generateTimeSlotsForDoctorOnDate(DoctorModel doctor, LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        
        // Check if doctor has schedule for this day
        DoctorScheduleModel schedule = doctorScheduleRepository.findByDoctorAndDayOfWeek(doctor, dayOfWeek)
                .orElse(null);

        if (schedule == null || !schedule.getIsAvailable()) {
            return; // Doctor not available on this day
        }

        // Generate time slots based on doctor's schedule
        LocalTime startTime = schedule.getStartTime();
        LocalTime endTime = schedule.getEndTime();
        int slotDuration = schedule.getSlotDurationMinutes();

        LocalTime currentTime = startTime;
        while (currentTime.plusMinutes(slotDuration).isBefore(endTime) || 
               currentTime.plusMinutes(slotDuration).equals(endTime)) {
            
            // Check if time slot already exists
            TimeSlotModel existingSlot = timeSlotRepository.findByDoctorAndSlotDateAndStartTime(
                    doctor, date, currentTime).orElse(null);

            if (existingSlot == null) {
                // Create new time slot
                TimeSlotModel timeSlot = new TimeSlotModel();
                timeSlot.setDoctor(doctor);
                timeSlot.setSlotDate(date);
                timeSlot.setStartTime(currentTime);
                timeSlot.setEndTime(currentTime.plusMinutes(slotDuration));
                timeSlot.setIsAvailable(true);
                timeSlot.setIsBooked(false);
                
                timeSlotRepository.save(timeSlot);
            }

            currentTime = currentTime.plusMinutes(slotDuration);
        }
    }

    private AvailableTimeSlotDto convertToAvailableTimeSlotDto(TimeSlotModel timeSlot) {
        AvailableTimeSlotDto dto = new AvailableTimeSlotDto();
        dto.setId(timeSlot.getId());
        dto.setDoctorId(timeSlot.getDoctor().getId());
        dto.setDoctorName(timeSlot.getDoctor().getUser().getFirstName() + " " + timeSlot.getDoctor().getUser().getLastName());
        dto.setDoctorSpecialization(timeSlot.getDoctor().getSpecialization());
        dto.setConsultationFee(timeSlot.getDoctor().getConsultationFee());
        dto.setSlotDate(timeSlot.getSlotDate());
        dto.setStartTime(timeSlot.getStartTime());
        dto.setEndTime(timeSlot.getEndTime());
        return dto;
    }
}
