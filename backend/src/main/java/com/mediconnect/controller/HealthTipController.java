// src/main/java/com/mediconnect/controller/HealthTipController.java
package com.mediconnect.controller;

import com.mediconnect.model.HealthTip;
import com.mediconnect.service.HealthTipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/health-tips")
//@CrossOrigin(origins = "*")  // ok for dev; rely on global CORS otherwise
public class HealthTipController {

    @Autowired
    private HealthTipService healthTipService;

    // ----- Patient endpoint (already have) -----
    @GetMapping("/personalized")
    public ResponseEntity<List<HealthTip>> getPersonalizedTips(
            @RequestParam int age,
            @RequestParam String gender,
            @RequestParam String condition) {
        List<HealthTip> tips = healthTipService.getPersonalizedTips(age, gender, condition);
        return ResponseEntity.ok(tips);
    }

    // ===== Admin endpoints =====

    // List (paged)
    @GetMapping
    public ResponseEntity<Page<HealthTip>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "tipId") String sortBy,
            @RequestParam(defaultValue = "desc") String dir) {

        Sort sort = "asc".equalsIgnoreCase(dir)
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<HealthTip> tips = healthTipService.list(pageable);
        return ResponseEntity.ok(tips);
    }

    // Create
    @PostMapping
    public ResponseEntity<HealthTip> create(@RequestBody HealthTip tip) {
        HealthTip saved = healthTipService.create(tip);
        return ResponseEntity.ok(saved);
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<HealthTip> update(@PathVariable Long id, @RequestBody HealthTip tip) {
        HealthTip updated = healthTipService.update(id, tip);
        return ResponseEntity.ok(updated);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        healthTipService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

