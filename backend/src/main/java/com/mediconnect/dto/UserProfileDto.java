// backend/src/main/java/com/mediconnect/dto/UserProfileDto.java
package com.mediconnect.dto;

import com.mediconnect.model.UserModel;

public record UserProfileDto(
        String id,
        String name,
        String email,
        String phone,
        String createdAt
) {
    public static UserProfileDto from(UserModel u) {
        String name = ((u.getFirstName() != null ? u.getFirstName() : "") + " " +
                       (u.getLastName()  != null ? u.getLastName()  : "")).trim();
        if (name.isEmpty()) name = u.getEmail();
        return new UserProfileDto(
            u.getId(),
            name,
            u.getEmail(),
            u.getPhone(),
            u.getCreatedAt() != null ? u.getCreatedAt().toString() : null
        );
    }
}