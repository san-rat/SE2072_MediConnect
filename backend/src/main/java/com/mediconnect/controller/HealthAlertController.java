package com.mediconnect.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.OPTIONS;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;
import org.springframework.web.bind.annotation.RestController;

import com.mediconnect.dto.CreateHealthAlertRequest;
import com.mediconnect.dto.HealthAlertDto;
import com.mediconnect.dto.UpdateHealthAlertRequest;
import com.mediconnect.model.HealthAlert;
import com.mediconnect.service.HealthAlertService;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(
        origins = {
                "http://localhost:3000",
                "http://localhost:5173",
                "https://mediconnect-iota.vercel.app"
        },
        allowCredentials = "true",
        methods = {GET, POST, PUT, DELETE, OPTIONS}
)
public class HealthAlertController {

    private final HealthAlertService service;

    public HealthAlertController(HealthAlertService service) {
        this.service = service;
    }

    // Create Alert
    @PostMapping
    public ResponseEntity<HealthAlertDto> createAlert(@RequestBody CreateHealthAlertRequest req) {
        HealthAlert created = service.createAlert(req.toEntity());
        return ResponseEntity.ok(HealthAlertDto.from(created));
    }

    // Get All Alerts
    @GetMapping
    public ResponseEntity<List<HealthAlertDto>> getAllAlerts() {
        var list = service.getAllAlerts().stream().map(HealthAlertDto::from).toList();
        return ResponseEntity.ok(list);
    }

    // Get Alert by ID
    @GetMapping("/{id}")
    public ResponseEntity<HealthAlertDto> getAlertById(@PathVariable Long id) {
        var alert = service.getAlertById(id);
        if (alert == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(HealthAlertDto.from(alert));
    }

    // Update Alert (full replace semantics using body)
    @PutMapping("/{id}")
    public ResponseEntity<HealthAlertDto> updateAlert(@PathVariable Long id,
                                                      @RequestBody UpdateHealthAlertRequest req) {
        HealthAlert patch = new HealthAlert();
        patch.setTitle(req.title());
        patch.setDescription(req.description());
        patch.setType(req.type());
        patch.setEventDate(req.eventDateAsLocalDate());

        var updated = service.updateAlert(id, patch);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(HealthAlertDto.from(updated));
    }

    // Delete Alert
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(@PathVariable Long id) {
        service.deleteAlert(id);
        return ResponseEntity.noContent().build();
    }

    // Get Upcoming Alerts
    @GetMapping("/upcoming")
    public ResponseEntity<List<HealthAlertDto>> getUpcomingAlerts() {
        var list = service.getUpcomingAlerts().stream().map(HealthAlertDto::from).toList();
        return ResponseEntity.ok(list);
    }
}
