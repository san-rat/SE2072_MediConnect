package com.mediconnect.dto;

import com.mediconnect.model.Notification;
import java.time.LocalDateTime;

public record NotificationDto(
        Long id,
        String title,
        String message,
        String type,            // will be lowercase (e.g., "health_awareness")
        Boolean isRead,
        LocalDateTime createdAt
) {
    public static NotificationDto from(Notification n) {
        return new NotificationDto(
                n.getId(),
                n.getTitle(),
                n.getMessage(),
                n.getType() == null ? null : n.getType().name(), // enum -> "health_awareness"
                n.isRead(),                                      // or n.getIsRead() if that's your getter
                n.getCreatedAt()
        );
    }
}
