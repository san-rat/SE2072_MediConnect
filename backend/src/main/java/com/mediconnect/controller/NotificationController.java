package com.mediconnect.controller;

import com.mediconnect.dto.CreateNotificationRequest;
import com.mediconnect.dto.NotificationDto;
import com.mediconnect.model.Notification;
import com.mediconnect.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Create a new notification for a user
    @PostMapping("/{userId}")
    public ResponseEntity<NotificationDto> createNotification(
            @PathVariable String userId,
            @RequestBody CreateNotificationRequest req) {

        Notification created = notificationService.createNotification(req.toEntity(), userId);
        return ResponseEntity.ok(NotificationDto.from(created));
    }

    // Get all notifications (DTO)
    @GetMapping
    public ResponseEntity<List<NotificationDto>> getAllNotifications() {
        List<NotificationDto> list = notificationService.getAllNotifications()
                .stream().map(NotificationDto::from).toList();
        return ResponseEntity.ok(list);
    }

    // Get notifications by user ID (DTO)
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<NotificationDto>> getNotificationsByUserId(@PathVariable String userId) {
        List<NotificationDto> list = notificationService.getNotificationsByUserId(userId)
                .stream().map(NotificationDto::from).toList();
        return ResponseEntity.ok(list);
    }

    // Get notifications by email (DTO)
    @GetMapping("/by-email")
    public ResponseEntity<List<NotificationDto>> getNotificationsByEmail(@RequestParam String email) {
        List<NotificationDto> list = notificationService.getNotificationsByEmail(email)
                .stream().map(NotificationDto::from).toList();
        return ResponseEntity.ok(list);
    }

    // Get notifications by first name (DTO)
    @GetMapping("/by-first-name")
    public ResponseEntity<List<NotificationDto>> getNotificationsByFirstName(@RequestParam String firstName) {
        List<NotificationDto> list = notificationService.getNotificationsByFirstName(firstName)
                .stream().map(NotificationDto::from).toList();
        return ResponseEntity.ok(list);
    }


    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationDto> markAsRead(@PathVariable Long notificationId) {
        Notification updated = notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(NotificationDto.from(updated));
    }
}
