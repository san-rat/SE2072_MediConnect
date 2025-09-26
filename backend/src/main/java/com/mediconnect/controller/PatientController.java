package com.mediconnect.controller;

import com.mediconnect.dto.PatientProfileDto;
import com.mediconnect.dto.RegisterPatientDto;
import com.mediconnect.dto.UpdatePatientProfileDto;
import com.mediconnect.model.PatientModel;
import com.mediconnect.model.UserModel;
import com.mediconnect.service.PatientService;
import com.mediconnect.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;
    private final UserService userService;

    public PatientController(PatientService patientService, UserService userService) {
        this.patientService = patientService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public PatientModel registerPatient(@RequestBody RegisterPatientDto dto) {
        // Create User
        UserModel user = new UserModel();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setPhone(dto.getPhone());
        userService.saveUser(user);

        // Create Patient
        PatientModel patient = new PatientModel();
        patient.setUser(user);
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setEmergencyContact(dto.getEmergencyContact());
        patient.setBloodGroup(dto.getBloodGroup());
        patient.setMedicalHistory(dto.getMedicalHistory());
        return patientService.savePatient(patient);
    }

    @GetMapping("/profile")
    public PatientProfileDto getCurrentPatientProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        UserModel user = userService.findByEmail(email);
        PatientModel patient = patientService.findByUserId(user.getId());
        
        if (patient == null) {
            throw new RuntimeException("Patient profile not found");
        }
        
        return PatientProfileDto.from(patient);
    }

    @PutMapping("/profile")
    public PatientProfileDto updateCurrentPatientProfile(@Valid @RequestBody UpdatePatientProfileDto dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        UserModel user = userService.findByEmail(email);
        PatientModel patient = patientService.findByUserId(user.getId());
        
        if (patient == null) {
            throw new RuntimeException("Patient profile not found");
        }
        
        // Update user information
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setUpdatedAt(LocalDateTime.now());
        userService.saveUser(user);
        
        // Update patient information
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setEmergencyContact(dto.getEmergencyContact());
        patient.setBloodGroup(dto.getBloodGroup());
        patient.setMedicalHistory(dto.getMedicalHistory());
        patientService.savePatient(patient);
        
        return PatientProfileDto.from(patient);
    }
}
