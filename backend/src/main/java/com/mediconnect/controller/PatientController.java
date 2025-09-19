package com.mediconnect.controller;

import com.mediconnect.dto.RegisterPatientDto;
import com.mediconnect.model.PatientModel;
import com.mediconnect.model.UserModel;
import com.mediconnect.service.PatientService;
import com.mediconnect.service.UserService;
import org.springframework.web.bind.annotation.*;

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
}
