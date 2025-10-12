package com.mediconnect.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome to MediConnect API");
        response.put("status", "running");
        response.put("version", "1.0.0");
        response.put("endpoints", Map.of(
            "login", "/api/auth/login",
            "register_doctor", "/api/auth/register/doctor",
            "register_patient", "/api/auth/register/patient",
            "doctors", "/api/doctors",
            "patients", "/api/patients"
        ));
        return response;
    }
}
