package com.mediconnect.dto;

import com.mediconnect.model.HealthAlert;

import java.time.LocalDate;

/** Request payload for creating a HealthAlert. */
public record CreateHealthAlertRequest(
        String title,
        String description,
        String type,         // e.g. "vaccination", "blood_donation", "health_camp"
        String eventDate     // "YYYY-MM-DD" (optional)
) {
    public HealthAlert toEntity() {
        HealthAlert a = new HealthAlert();
        a.setTitle(title);
        a.setDescription(description);
        a.setType(type);  // if your entity uses an enum, map here: a.setType(AlertType.valueOf(...))
        if (eventDate != null && !eventDate.isBlank()) {
            a.setEventDate(LocalDate.parse(eventDate));
        }
        return a;
    }
}
