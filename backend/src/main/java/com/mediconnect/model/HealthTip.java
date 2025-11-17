package com.mediconnect.model;

import jakarta.persistence.*;

@Entity
@Table(name = "health_tips")
public class HealthTip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tipId;

    @Column(name = "condition_name", nullable = false, length = 100)
    private String condition;

    @Column(nullable = false)
    private int ageMin;

    @Column(nullable = false)
    private int ageMax;

    @Column(nullable = false, length = 20)
    private String gender;

    @Column(nullable = false, length = 1000)
    private String message;

    public HealthTip() {}

    public HealthTip(String condition, int ageMin, int ageMax, String gender, String message) {
        this.condition = condition;
        this.ageMin = ageMin;
        this.ageMax = ageMax;
        this.gender = gender;
        this.message = message;
    }

    // Getters & setters (or Lombok @Getter/@Setter if you use Lombok)
    public Long getTipId() { return tipId; }
    public void setTipId(Long tipId) { this.tipId = tipId; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public int getAgeMin() { return ageMin; }
    public void setAgeMin(int ageMin) { this.ageMin = ageMin; }

    public int getAgeMax() { return ageMax; }
    public void setAgeMax(int ageMax) { this.ageMax = ageMax; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
