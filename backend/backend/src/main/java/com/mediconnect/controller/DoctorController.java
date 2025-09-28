package com.mediconnect.controller;

import com.mediconnect.dto.RegisterDoctorDto;
import com.mediconnect.model.DoctorModel;
import com.mediconnect.model.UserModel;
import com.mediconnect.service.DoctorService;
import com.mediconnect.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;
    private final UserService userService;

    public DoctorController(DoctorService doctorService, UserService userService) {
        this.doctorService = doctorService;
        this.userService = userService;
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
}

