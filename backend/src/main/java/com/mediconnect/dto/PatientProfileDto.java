package com.mediconnect.dto;

import com.mediconnect.model.PatientModel;
import com.mediconnect.model.UserModel;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record PatientProfileDto(
        String id,
        String firstName,
        String lastName,
        String email,
        String phone,
        LocalDate dateOfBirth,
        String emergencyContact,
        String bloodGroup,
        String medicalHistory,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static PatientProfileDto from(PatientModel patient) {
        UserModel user = patient.getUser();
        return new PatientProfileDto(
            patient.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getPhone(),
            patient.getDateOfBirth(),
            patient.getEmergencyContact(),
            patient.getBloodGroup(),
            patient.getMedicalHistory(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}
