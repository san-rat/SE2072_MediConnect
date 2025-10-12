package com.mediconnect.dto;

import com.mediconnect.model.HealthAlert;

import java.time.LocalDate;

/** Flat DTO for HealthAlert to keep responses serialization-safe. */
public record HealthAlertDto(
        Long id,
        String title,
        String description,
        String type,        // keep as string for the frontend ("vaccination", "blood_donation", ...)
        LocalDate eventDate
) {
    public static HealthAlertDto from(HealthAlert a) {
        return new HealthAlertDto(
                a.getId(),
                a.getTitle(),
                a.getDescription(),
                a.getType(),      // if your entity uses an enum, change to a.getType().name().toLowerCase()
                a.getEventDate()
        );
    }
}
