package com.mediconnect.controller;

import com.mediconnect.dto.LoginRequest;
import com.mediconnect.dto.RegisterDoctorDto;
import com.mediconnect.dto.RegisterPatientDto;
import com.mediconnect.model.UserModel;
import com.mediconnect.model.DoctorModel;
import com.mediconnect.model.PatientModel;
import com.mediconnect.service.UserService;
import com.mediconnect.service.DoctorService;
import com.mediconnect.service.PatientService;
import com.mediconnect.service.AdminService;
import com.mediconnect.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final DoctorService doctorService;
    private final PatientService patientService;
    private final AdminService adminService;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService,
                          DoctorService doctorService,
                          PatientService patientService,
                          AdminService adminService,
                          AuthenticationManager authManager,
                          JwtUtil jwtUtil) {
        this.userService = userService;
        this.doctorService = doctorService;
        this.patientService = patientService;
        this.adminService = adminService;
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {
        var auth = new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());
        authManager.authenticate(auth); // throws if bad creds
        
        // Get user to determine role
        UserModel user = userService.findByEmail(request.getEmail());
        String role = "USER"; // default role
        
        // Check if user is an admin first (highest priority)
        if (adminService.findByUserId(user.getId()) != null) {
            role = "ADMIN";
        } else if (doctorService.findByUserId(user.getId()) != null) {
            role = "DOCTOR";
        } else if (patientService.findByUserId(user.getId()) != null) {
            role = "PATIENT";
        }
        
        String token = jwtUtil.generateToken(request.getEmail(), role);
        Map<String, Object> resp = new HashMap<>();
        resp.put("token", token);
        resp.put("type", "Bearer");
        resp.put("role", role);
        return resp;
    }

    @PostMapping("/register/doctor")
    public DoctorModel registerDoctor(@Valid @RequestBody RegisterDoctorDto dto) {
        UserModel user = new UserModel();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setPhone(dto.getPhone());
        userService.saveUser(user);

        DoctorModel doctor = new DoctorModel();
        doctor.setUser(user);
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setLicenseNumber(dto.getLicenseNumber());
        doctor.setYearsExperience(dto.getYearsExperience());
        doctor.setConsultationFee(dto.getConsultationFee().doubleValue());
        return doctorService.saveDoctor(doctor);
    }

    @PostMapping("/register/patient")
    public PatientModel registerPatient(@Valid @RequestBody RegisterPatientDto dto) {
        UserModel user = new UserModel();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setPhone(dto.getPhone());
        userService.saveUser(user);

        PatientModel patient = new PatientModel();
        patient.setUser(user);
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setEmergencyContact(dto.getEmergencyContact());
        patient.setBloodGroup(dto.getBloodGroup());
        patient.setMedicalHistory(dto.getMedicalHistory());
        return patientService.savePatient(patient);
    }
}