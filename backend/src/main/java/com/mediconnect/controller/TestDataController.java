package com.mediconnect.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mediconnect.model.DoctorModel;
import com.mediconnect.repository.DoctorScheduleRepository;
import com.mediconnect.service.DoctorService;
import com.mediconnect.service.TimeSlotService;

@RestController
@RequestMapping("/api/test")
public class TestDataController {

    @Autowired
    private TimeSlotService timeSlotService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private DoctorScheduleRepository doctorScheduleRepository;

    // Generate time slots for all doctors for the next 30 days
    @PostMapping("/generate-time-slots")
    public ResponseEntity<?> generateTimeSlots(@RequestParam(defaultValue = "30") int days) {
        try {
            List<DoctorModel> doctors = doctorService.getAllDoctors();
            
            if (doctors.isEmpty()) {
                return ResponseEntity.badRequest().body("No doctors found. Please create doctors first.");
            }

            LocalDate startDate = LocalDate.now();
            LocalDate endDate = startDate.plusDays(days);

            // Generate time slots for each doctor
            for (DoctorModel doctor : doctors) {
                timeSlotService.generateTimeSlotsForDoctor(doctor.getId(), startDate, endDate);
            }

            return ResponseEntity.ok("Time slots generated successfully for " + doctors.size() + " doctors for the next " + days + " days.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error generating time slots: " + e.getMessage());
        }
    }

    // Get database statistics
    @GetMapping("/stats")
    public ResponseEntity<?> getDatabaseStats() {
        try {
            long totalTimeSlots = timeSlotService.getTotalTimeSlotsCount();
            List<DoctorModel> doctors = doctorService.getAllDoctors();
            
            return ResponseEntity.ok(java.util.Map.of(
                "totalDoctors", doctors.size(),
                "totalTimeSlots", totalTimeSlots,
                "doctors", doctors.stream().map(d -> java.util.Map.of(
                    "id", d.getId(),
                    "name", d.getUser().getFirstName() + " " + d.getUser().getLastName(),
                    "specialization", d.getSpecialization()
                )).toList()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting stats: " + e.getMessage());
        }
    }

    // Check if doctor schedules exist (diagnostic endpoint)
    @GetMapping("/check-schedules")
    public ResponseEntity<?> checkDoctorSchedules() {
        try {
            List<DoctorModel> doctors = doctorService.getAllDoctors();
            java.util.Map<String, Object> result = new java.util.HashMap<>();
            
            for (DoctorModel doctor : doctors) {
                try {
                    List<com.mediconnect.model.DoctorScheduleModel> schedules = 
                        doctorScheduleRepository.findByDoctorOrderByDayOfWeek(doctor);
                    result.put(doctor.getId(), java.util.Map.of(
                        "name", doctor.getUser().getFirstName() + " " + doctor.getUser().getLastName(),
                        "hasSchedules", !schedules.isEmpty(),
                        "scheduleCount", schedules.size(),
                        "schedules", schedules.stream().map(s -> java.util.Map.of(
                            "dayOfWeek", s.getDayOfWeek(),
                            "startTime", s.getStartTime(),
                            "endTime", s.getEndTime(),
                            "isAvailable", s.getIsAvailable()
                        )).toList()
                    ));
                } catch (Exception e) {
                    result.put(doctor.getId(), java.util.Map.of(
                        "name", doctor.getUser().getFirstName() + " " + doctor.getUser().getLastName(),
                        "error", "Could not check schedules: " + e.getMessage()
                    ));
                }
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error checking schedules: " + e.getMessage());
        }
    }
}
