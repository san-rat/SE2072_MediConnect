package com.mediconnect.controller;

import com.mediconnect.dto.AppointmentResponseDto;
import com.mediconnect.dto.AvailableTimeSlotDto;
import com.mediconnect.dto.BookAppointmentDto;
import com.mediconnect.model.AppointmentModel;
import com.mediconnect.model.DoctorModel;
import com.mediconnect.model.UserModel;
import com.mediconnect.repository.DoctorRepository;
import com.mediconnect.service.AppointmentService;
import com.mediconnect.service.TimeSlotService;
import com.mediconnect.service.UserService;
import com.mediconnect.util.JwtUtil;
import com.mediconnect.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private TimeSlotService timeSlotService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private DoctorRepository doctorRepository;

    // Book a new appointment
    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@Valid @RequestBody BookAppointmentDto bookAppointmentDto,
                                           @RequestHeader("Authorization") String token) {
        try {
            String userEmail = jwtUtil.extractUserId(token.substring(7)); // This actually returns email
            AppointmentResponseDto appointment = appointmentService.bookAppointmentByEmail(bookAppointmentDto, userEmail);
            return ResponseEntity.ok(appointment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error booking appointment: " + e.getMessage());
        }
    }

    // Get all appointments for the current patient
    @GetMapping("/my-appointments")
    public ResponseEntity<?> getMyAppointments(@RequestHeader("Authorization") String token) {
        try {
            String patientId = jwtUtil.extractUserId(token.substring(7));
            List<AppointmentResponseDto> appointments = appointmentService.getAppointmentsByPatient(patientId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching appointments: " + e.getMessage());
        }
    }

    // Get upcoming appointments for the current patient
    @GetMapping("/upcoming")
    public ResponseEntity<?> getUpcomingAppointments(@RequestHeader("Authorization") String token) {
        try {
            String userEmail = jwtUtil.extractUserId(token.substring(7)); // This actually returns email
            List<AppointmentResponseDto> appointments = appointmentService.getUpcomingAppointmentsByPatientEmail(userEmail);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching upcoming appointments: " + e.getMessage());
        }
    }

    // Get past appointments for the current patient
    @GetMapping("/history")
    public ResponseEntity<?> getAppointmentHistory(@RequestHeader("Authorization") String token) {
        try {
            String userEmail = jwtUtil.extractUserId(token.substring(7)); // This actually returns email
            List<AppointmentResponseDto> appointments = appointmentService.getPastAppointmentsByPatientEmail(userEmail);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching appointment history: " + e.getMessage());
        }
    }

    // Get appointment by ID
    @GetMapping("/{appointmentId}")
    public ResponseEntity<?> getAppointmentById(@PathVariable String appointmentId) {
        try {
            AppointmentResponseDto appointment = appointmentService.getAppointmentById(appointmentId);
            return ResponseEntity.ok(appointment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching appointment: " + e.getMessage());
        }
    }

    // Cancel appointment
    @PutMapping("/{appointmentId}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable String appointmentId) {
        try {
            AppointmentResponseDto appointment = appointmentService.cancelAppointment(appointmentId);
            return ResponseEntity.ok(appointment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error cancelling appointment: " + e.getMessage());
        }
    }

    // Get available time slots for a specific doctor and date
    @GetMapping("/available-slots/{doctorId}")
    public ResponseEntity<?> getAvailableTimeSlots(@PathVariable String doctorId,
                                                  @RequestParam LocalDate date) {
        try {
            List<AvailableTimeSlotDto> timeSlots = timeSlotService.getAvailableTimeSlotsForDoctor(doctorId, date);
            return ResponseEntity.ok(timeSlots);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching available time slots: " + e.getMessage());
        }
    }

    // Get available time slots for a specific doctor in a date range
    @GetMapping("/available-slots/{doctorId}/range")
    public ResponseEntity<?> getAvailableTimeSlotsInRange(@PathVariable String doctorId,
                                                         @RequestParam LocalDate startDate,
                                                         @RequestParam LocalDate endDate) {
        try {
            List<AvailableTimeSlotDto> timeSlots = timeSlotService.getAvailableTimeSlotsForDoctor(doctorId, startDate, endDate);
            return ResponseEntity.ok(timeSlots);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching available time slots: " + e.getMessage());
        }
    }

    // Get available time slots by specialization on a specific date
    @GetMapping("/available-slots/specialization/{specialization}")
    public ResponseEntity<?> getAvailableTimeSlotsBySpecialization(@PathVariable String specialization,
                                                                  @RequestParam LocalDate date) {
        try {
            List<AvailableTimeSlotDto> timeSlots = timeSlotService.getAvailableTimeSlotsBySpecialization(specialization, date);
            return ResponseEntity.ok(timeSlots);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching available time slots: " + e.getMessage());
        }
    }

    // Get all available time slots for a specific date
    @GetMapping("/available-slots/date/{date}")
    public ResponseEntity<?> getAllAvailableTimeSlotsForDate(@PathVariable LocalDate date) {
        try {
            List<AvailableTimeSlotDto> timeSlots = timeSlotService.getAvailableTimeSlotsForDate(date);
            return ResponseEntity.ok(timeSlots);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching available time slots: " + e.getMessage());
        }
    }

    // Check if appointment is available
    @GetMapping("/check-availability")
    public ResponseEntity<?> checkAppointmentAvailability(@RequestParam String doctorId,
                                                         @RequestParam LocalDate date,
                                                         @RequestParam String time) {
        try {
            boolean isAvailable = appointmentService.isAppointmentAvailable(doctorId, date, time);
            return ResponseEntity.ok(isAvailable);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error checking availability: " + e.getMessage());
        }
    }

    // Generate time slots for all doctors (Admin endpoint)
    @PostMapping("/admin/generate-slots")
    public ResponseEntity<?> generateTimeSlots(@RequestParam LocalDate startDate,
                                             @RequestParam LocalDate endDate) {
        try {
            timeSlotService.generateTimeSlotsForAllDoctors(startDate, endDate);
            return ResponseEntity.ok("Time slots generated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error generating time slots: " + e.getMessage());
        }
    }

    // Get appointments for a specific doctor
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getAppointmentsByDoctor(@PathVariable String doctorId) {
        try {
            List<AppointmentResponseDto> appointments = appointmentService.getAppointmentsByDoctor(doctorId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching doctor appointments: " + e.getMessage());
        }
    }

    // Get appointments for current doctor (using JWT token)
    @GetMapping("/doctor/my-appointments")
    public ResponseEntity<?> getMyAppointmentsAsDoctor(@RequestHeader("Authorization") String token) {
        try {
            String userEmail = jwtUtil.extractUserId(token.substring(7));
            // Find doctor by user email
            UserModel user = userService.findByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            DoctorModel doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "user_id", user.getId()));
            
            List<AppointmentResponseDto> appointments = appointmentService.getAppointmentsByDoctor(doctor.getId());
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching my appointments: " + e.getMessage());
        }
    }

    // Update appointment status (for doctors)
    @PutMapping("/{appointmentId}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable String appointmentId,
                                                   @RequestParam String status,
                                                   @RequestHeader("Authorization") String token) {
        try {
            AppointmentModel.AppointmentStatus appointmentStatus = AppointmentModel.AppointmentStatus.valueOf(status.toUpperCase());
            AppointmentResponseDto appointment = appointmentService.updateAppointmentStatus(appointmentId, appointmentStatus);
            return ResponseEntity.ok(appointment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating appointment status: " + e.getMessage());
        }
    }
}
