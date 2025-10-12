package com.mediconnect.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class NotificationTypeConverter implements AttributeConverter<NotificationType, String> {

    @Override
    public String convertToDatabaseColumn(NotificationType attribute) {
        if (attribute == null)
            return null;
        // Persist using enum name (underscored)
        return attribute.name();
    }

    @Override
    public NotificationType convertToEntityAttribute(String dbData) {
        if (dbData == null)
            return null;
        String normalized = dbData.trim();
        if (normalized.isEmpty())
            return NotificationType.general;

        // Normalize common variants and legacy values
        String upper = normalized.toUpperCase();
        switch (upper) {
            case "APPOINTMENT":
                return NotificationType.appointment;
            case "HEALTH_AWARENESS":
            case "HEALTH-AWARENESS":
            case "HEALTHAWARENESS":
                return NotificationType.health_awareness;
            case "URGENT":
                return NotificationType.urgent;
            case "GENERAL":
                return NotificationType.general;
            // Legacy/unknown values mapped safely
            case "REMINDER":
            case "REMINDERS":
            default:
                return NotificationType.general;
        }
    }
}
