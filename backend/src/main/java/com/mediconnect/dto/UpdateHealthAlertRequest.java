package com.mediconnect.dto;

import java.time.LocalDate;

/** Request payload for updating a HealthAlert (partial update allowed). */
public record UpdateHealthAlertRequest(
        String title,
        String description,
        String type,
        String eventDate     // "YYYY-MM-DD"
) {
    public LocalDate eventDateAsLocalDate() {
        if (eventDate == null || eventDate.isBlank()) return null;
        return LocalDate.parse(eventDate);
    }
}
