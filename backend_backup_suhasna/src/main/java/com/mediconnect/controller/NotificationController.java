package com.mediconnect.controller;

import com.mediconnect.model.Notification;
import com.mediconnect.service.NotificationService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*") // allow frontend requests
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    // Create notification (Admin)
    @PostMapping
    public Notification createNotification(@RequestBody Notification n) {
        return service.createNotification(n);
    }

    // Fetch notifications for a patient
    @GetMapping("/{userId}")
    public List<Notification> getNotifications(@PathVariable Long userId) {
        return service.getNotificationsByUser(userId);
    }

    // Mark as read
    @PatchMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {
        return service.markAsRead(id);
    }
}









