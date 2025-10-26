package com.mediconnect.dto;

import com.mediconnect.model.Notification;
import com.mediconnect.model.NotificationType;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

public record CreateNotificationRequest(
        String title,
        String message,
        String type,      // "appointment", "health_awareness", "urgent", "general"
        String priority   // optional for now
) {
    public Notification toEntity() {
        Notification n = new Notification();
        n.setTitle(title);
        n.setMessage(message);
        n.setType(parseType(type)); // <-- String -> enum (lowercase)
        // n.setIsRead(false); // optional default
        return n;
    }

    private static NotificationType parseType(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "type is required");
        }
        // normalize to LOWERCASE with underscores to match your enum names
        String normalized = raw.trim()
                .toLowerCase(Locale.ROOT)
                .replace('-', '_')
                .replace(' ', '_');

        try {
            return NotificationType.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid notification type: " + raw + " (allowed: appointment, health_awareness, urgent, general)"
            );
        }
    }
}
