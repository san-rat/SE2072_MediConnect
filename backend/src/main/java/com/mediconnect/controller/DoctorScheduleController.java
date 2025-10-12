package com.mediconnect.controller;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mediconnect.dto.AvailableTimeSlotDto;
import com.mediconnect.exception.ResourceNotFoundException;
import com.mediconnect.model.DoctorModel;
import com.mediconnect.model.DoctorScheduleModel;
import com.mediconnect.model.UserModel;
import com.mediconnect.repository.DoctorRepository;
import com.mediconnect.repository.DoctorScheduleRepository;
import com.mediconnect.service.TimeSlotService;
import com.mediconnect.service.UserService;
import com.mediconnect.util.JwtUtil;

@RestController
@RequestMapping("/api/doctor-schedule")
public class DoctorScheduleController {

    @Autowired
    private DoctorScheduleRepository doctorScheduleRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private TimeSlotService timeSlotService;

    @Autowired
    private JwtUtil jwtUtil;

    // Get doctor's schedule
    @GetMapping("/my-schedule")
    public ResponseEntity<?> getMySchedule(@RequestHeader("Authorization") String token) {
        try {
            String userEmail = jwtUtil.extractUserId(token.substring(7));
            UserModel user = userService.findByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            DoctorModel doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "user_id", user.getId()));
            
            List<DoctorScheduleModel> schedules = doctorScheduleRepository.findByDoctorOrderByDayOfWeek(doctor);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching schedule: " + e.getMessage());
        }
    }

    // Get doctor's current availability (schedules + time slots)
    @GetMapping("/my-availability")
    public ResponseEntity<?> getMyAvailability(@RequestHeader("Authorization") String token) {
        try {
            String userEmail = jwtUtil.extractUserId(token.substring(7));
            UserModel user = userService.findByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            DoctorModel doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "user_id", user.getId()));
            
            // Get schedules
            List<DoctorScheduleModel> schedules = doctorScheduleRepository.findByDoctorOrderByDayOfWeek(doctor);
            
            // Get time slots for next 7 days
            LocalDate startDate = LocalDate.now();
            LocalDate endDate = startDate.plusDays(7);
            List<AvailableTimeSlotDto> timeSlots = timeSlotService.getAvailableTimeSlotsForDoctor(doctor.getId(), startDate, endDate);
            
            return ResponseEntity.ok(Map.of(
                "schedules", schedules,
                "timeSlots", timeSlots,
                "doctorId", doctor.getId(),
                "doctorName", doctor.getUser().getFirstName() + " " + doctor.getUser().getLastName()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching doctor availability: " + e.getMessage());
        }
    }

    // Update doctor's schedule for a specific day
    @PostMapping("/update-schedule")
    public ResponseEntity<?> updateSchedule(@RequestHeader("Authorization") String token,
                                           @RequestParam DayOfWeek dayOfWeek,
                                           @RequestParam LocalTime startTime,
                                           @RequestParam LocalTime endTime,
                                           @RequestParam(defaultValue = "30") Integer slotDurationMinutes,
                                           @RequestParam(defaultValue = "true") Boolean isAvailable) {
        try {
            String userEmail = jwtUtil.extractUserId(token.substring(7));
            UserModel user = userService.findByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            DoctorModel doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "user_id", user.getId()));
            
            // Find existing schedule or create new one
            DoctorScheduleModel schedule = doctorScheduleRepository.findByDoctorAndDayOfWeek(doctor, dayOfWeek)
                .orElse(new DoctorScheduleModel());
            
            schedule.setDoctor(doctor);
            schedule.setDayOfWeek(dayOfWeek);
            schedule.setStartTime(startTime);
            schedule.setEndTime(endTime);
            schedule.setSlotDurationMinutes(slotDurationMinutes);
            schedule.setIsAvailable(isAvailable);
            
            DoctorScheduleModel savedSchedule = doctorScheduleRepository.save(schedule);
            return ResponseEntity.ok(savedSchedule);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating schedule: " + e.getMessage());
        }
    }

    // Set availability for a specific date
    @PostMapping("/set-availability")
    public ResponseEntity<?> setAvailability(@RequestHeader("Authorization") String token,
                                            @RequestParam String dateStr,
                                            @RequestParam String startTimeStr,
                                            @RequestParam String endTimeStr,
                                            @RequestParam(defaultValue = "30") Integer slotDurationMinutes) {
        try {
            String userEmail = jwtUtil.extractUserId(token.substring(7));
            UserModel user = userService.findByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            DoctorModel doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "user_id", user.getId()));
            
            // Parse date and time strings
            LocalDate date = LocalDate.parse(dateStr);
            LocalTime startTime = LocalTime.parse(startTimeStr);
            LocalTime endTime = LocalTime.parse(endTimeStr);
            
            // Create or update schedule for the specific day
            DayOfWeek dayOfWeek = date.getDayOfWeek();
            DoctorScheduleModel schedule = doctorScheduleRepository.findByDoctorAndDayOfWeek(doctor, dayOfWeek)
                .orElse(new DoctorScheduleModel());
            
            schedule.setDoctor(doctor);
            schedule.setDayOfWeek(dayOfWeek);
            schedule.setStartTime(startTime);
            schedule.setEndTime(endTime);
            schedule.setSlotDurationMinutes(slotDurationMinutes);
            schedule.setIsAvailable(true);
            
            doctorScheduleRepository.save(schedule);
            
            // Generate time slots for the specific date
            timeSlotService.generateTimeSlotsForDoctor(doctor.getId(), date, date);
            
            return ResponseEntity.ok("Availability set successfully for " + date + ". Time slots have been generated.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error setting availability: " + e.getMessage());
        }
    }

    // Set recurring availability
    @PostMapping("/set-recurring-availability")
    public ResponseEntity<?> setRecurringAvailability(@RequestHeader("Authorization") String token,
                                                     @RequestBody RecurringAvailabilityRequest request) {
        try {
            String userEmail = jwtUtil.extractUserId(token.substring(7));
            UserModel user = userService.findByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            DoctorModel doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "user_id", user.getId()));
            
            // Update schedules for each day
            for (String dayName : request.getDays()) {
                DayOfWeek day = DayOfWeek.valueOf(dayName);
                DoctorScheduleModel schedule = doctorScheduleRepository.findByDoctorAndDayOfWeek(doctor, day)
                    .orElse(new DoctorScheduleModel());
                
                schedule.setDoctor(doctor);
                schedule.setDayOfWeek(day);
                schedule.setStartTime(request.getStartTime());
                schedule.setEndTime(request.getEndTime());
                schedule.setSlotDurationMinutes(request.getSlotDurationMinutes());
                schedule.setIsAvailable(true);
                
                doctorScheduleRepository.save(schedule);
            }
            
            // Generate time slots for the next 30 days based on the updated schedule
            LocalDate startDate = LocalDate.now();
            LocalDate endDate = startDate.plusDays(30);
            timeSlotService.generateTimeSlotsForDoctor(doctor.getId(), startDate, endDate);
            
            return ResponseEntity.ok("Recurring availability set successfully. Time slots have been generated for the next 30 days.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error setting recurring availability: " + e.getMessage());
        }
    }

    // DTO for recurring availability request
    public static class RecurringAvailabilityRequest {
        private List<String> days;
        private LocalTime startTime;
        private LocalTime endTime;
        private Integer slotDurationMinutes;

        // Getters and setters
        public List<String> getDays() { return days; }
        public void setDays(List<String> days) { this.days = days; }
        
        public LocalTime getStartTime() { return startTime; }
        public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
        
        public LocalTime getEndTime() { return endTime; }
        public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
        
        public Integer getSlotDurationMinutes() { return slotDurationMinutes; }
        public void setSlotDurationMinutes(Integer slotDurationMinutes) { this.slotDurationMinutes = slotDurationMinutes; }
    }

}
