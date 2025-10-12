package com.mediconnect.controller;

import com.mediconnect.dto.RegisterDoctorDto;
import com.mediconnect.model.DoctorModel;
import com.mediconnect.model.UserModel;
import com.mediconnect.service.DoctorService;
import com.mediconnect.service.UserService;
import com.mediconnect.service.AppointmentService;
import com.mediconnect.util.JwtUtil;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;
    private final UserService userService;
    private final AppointmentService appointmentService;
    private final JwtUtil jwtUtil;

    @Autowired
    public DoctorController(DoctorService doctorService, UserService userService, 
                           AppointmentService appointmentService, JwtUtil jwtUtil) {
        this.doctorService = doctorService;
        this.userService = userService;
        this.appointmentService = appointmentService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public List<DoctorModel> getAllDoctors() {
        return doctorService.getAllDoctors();
    }


    @PostMapping("/register")
    public DoctorModel registerDoctor(@RequestBody RegisterDoctorDto dto) {
        // Create User
        UserModel user = new UserModel();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setPhone(dto.getPhone());
        userService.saveUser(user);

        // Create Doctor
        DoctorModel doctor = new DoctorModel();
        doctor.setUser(user);
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setLicenseNumber(dto.getLicenseNumber());
        doctor.setYearsExperience(dto.getYearsExperience());
        doctor.setConsultationFee(dto.getConsultationFee().doubleValue());
        return doctorService.saveDoctor(doctor);
    }

    // Get dashboard statistics for current doctor
    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats(@RequestHeader("Authorization") String token) {
        try {
            String userEmail = jwtUtil.extractUserId(token.substring(7));
            UserModel user = userService.findByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            DoctorModel doctor = doctorService.findByUserId(user.getId());
            if (doctor == null) {
                return ResponseEntity.badRequest().body("Doctor not found");
            }

            // Get all appointments for this doctor
            List<com.mediconnect.dto.AppointmentResponseDto> allAppointments = 
                appointmentService.getAppointmentsByDoctor(doctor.getId());
            
            // Get today's appointments
            LocalDate today = LocalDate.now();
            List<com.mediconnect.dto.AppointmentResponseDto> todayAppointments = 
                allAppointments.stream()
                    .filter(apt -> apt.getAppointmentDate().equals(today))
                    .toList();

            // Get unique patients count
            long uniquePatientsCount = allAppointments.stream()
                .map(com.mediconnect.dto.AppointmentResponseDto::getPatientId)
                .distinct()
                .count();

            // Count pending prescriptions (for now, we'll use a placeholder)
            // This would need to be implemented when prescription system is ready
            int pendingPrescriptions = 0;

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalAppointments", allAppointments.size());
            stats.put("todayAppointments", todayAppointments.size());
            stats.put("totalPatients", (int) uniquePatientsCount);
            stats.put("pendingPrescriptions", pendingPrescriptions);
            stats.put("recentAppointments", todayAppointments.stream()
                .limit(5)
                .map(apt -> {
                    Map<String, Object> aptData = new HashMap<>();
                    aptData.put("id", apt.getId());
                    aptData.put("time", apt.getAppointmentTime());
                    aptData.put("patientName", apt.getPatientName());
                    aptData.put("type", "Consultation"); // Default type
                    aptData.put("status", apt.getStatus());
                    return aptData;
                })
                .toList());

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching dashboard stats: " + e.getMessage());
        }
    }

    // Add test appointments for demo purposes
    @PostMapping("/add-test-appointments")
    public ResponseEntity<?> addTestAppointments(@RequestHeader("Authorization") String token) {
        try {
            String userEmail = jwtUtil.extractUserId(token.substring(7));
            UserModel user = userService.findByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            DoctorModel doctor = doctorService.findByUserId(user.getId());
            if (doctor == null) {
                return ResponseEntity.badRequest().body("Doctor not found");
            }

            // This would need to be implemented in the appointment service
            // For now, just return a success message
            return ResponseEntity.ok("Test appointments would be added here. This endpoint is for demo purposes.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding test appointments: " + e.getMessage());
        }
    }
}

