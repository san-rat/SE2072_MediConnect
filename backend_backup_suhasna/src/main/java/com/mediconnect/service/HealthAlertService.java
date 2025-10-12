package com.mediconnect.service;

import com.mediconnect.model.HealthAlert;
import com.mediconnect.repository.HealthAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class HealthAlertService {

    @Autowired
    private HealthAlertRepository repository;

    public HealthAlert createAlert(HealthAlert alert) {
        return repository.save(alert);
    }

    public List<HealthAlert> getAllAlerts() {
        return repository.findAll();
    }

    public HealthAlert getAlertById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public HealthAlert updateAlert(Long id, HealthAlert updatedAlert) {
        return repository.findById(id).map(alert -> {
            alert.setTitle(updatedAlert.getTitle());
            alert.setDescription(updatedAlert.getDescription());
            alert.setType(updatedAlert.getType());
            alert.setEventDate(updatedAlert.getEventDate());
            return repository.save(alert);
        }).orElse(null);
    }

    public void deleteAlert(Long id) {
        repository.deleteById(id);
    }

    public List<HealthAlert> getUpcomingAlerts() {
        return repository.findByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate.now());
    }
}
