package com.mediconnect.controller;

import com.mediconnect.model.HealthAlert;
import com.mediconnect.service.HealthAlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alerts")
@CrossOrigin(origins = "*") // allow frontend calls
public class HealthAlertController {

    @Autowired
    private HealthAlertService service;

    // Create Alert
    @PostMapping
    public HealthAlert createAlert(@RequestBody HealthAlert alert) {
        return service.createAlert(alert);
    }

    // Get All Alerts
    @GetMapping
    public List<HealthAlert> getAllAlerts() {
        return service.getAllAlerts();
    }

    // Get Alert by ID
    @GetMapping("/{id}")
    public HealthAlert getAlertById(@PathVariable Long id) {
        return service.getAlertById(id);
    }

    // Update Alert
    @PutMapping("/{id}")
    public HealthAlert updateAlert(@PathVariable Long id, @RequestBody HealthAlert alert) {
        return service.updateAlert(id, alert);
    }

    // Delete Alert
    @DeleteMapping("/{id}")
    public void deleteAlert(@PathVariable Long id) {
        service.deleteAlert(id);
    }

    // Get Upcoming Alerts
    @GetMapping("/upcoming")
    public List<HealthAlert> getUpcomingAlerts() {
        return service.getUpcomingAlerts();
    }
}
