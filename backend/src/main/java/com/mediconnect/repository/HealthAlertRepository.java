package com.mediconnect.repository;

import com.mediconnect.model.HealthAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface HealthAlertRepository extends JpaRepository<HealthAlert, Long> {
    List<HealthAlert> findByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate date);
}
