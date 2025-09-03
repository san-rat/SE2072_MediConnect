package com.mediconnect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admins")
public class AdminModel {

    @Id
    @Column(length = 36)
    private String id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserModel user;

    @Column(name = "role_level")
    private String roleLevel;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public AdminModel() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public UserModel getUser() { return user; }
    public void setUser(UserModel user) { this.user = user; }
    public String getRoleLevel() { return roleLevel; }
    public void setRoleLevel(String roleLevel) { this.roleLevel = roleLevel; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
