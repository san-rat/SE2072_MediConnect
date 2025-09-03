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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final DoctorService doctorService;
    private final PatientService patientService;

    public AuthController(UserService userService,
                          DoctorService doctorService,
                          PatientService patientService) {
        this.userService = userService;
        this.doctorService = doctorService;
        this.patientService = patientService;
    }

    // User login
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        List<UserModel> users = userService.getAllUsers();
        for (UserModel user : users) {
            if (user.getEmail().equals(request.getEmail()) &&
                user.getPassword().equals(request.getPassword())) {
                return "Login successful!";
            }
        }
        return "Invalid credentials";
    }

    // Register Doctor
    @PostMapping("/register/doctor")
    public DoctorModel registerDoctor(@RequestBody RegisterDoctorDto dto) {
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
        doctor.setConsultationFee(dto.getConsultationFee());
        return doctorService.saveDoctor(doctor);
    }

    // Register Patient
    @PostMapping("/register/patient")
    public PatientModel registerPatient(@RequestBody RegisterPatientDto dto) {
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
