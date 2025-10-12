package com.mediconnect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
public class FeedbackModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientModel patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private DoctorModel doctor;

    @Column
    private Integer rating;

    @Column
    private String comment;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public FeedbackModel() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public PatientModel getPatient() { return patient; }
    public void setPatient(PatientModel patient) { this.patient = patient; }
    public DoctorModel getDoctor() { return doctor; }
    public void setDoctor(DoctorModel doctor) { this.doctor = doctor; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
