package com.mediconnect.service;

import com.mediconnect.model.Notification;
import com.mediconnect.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository repo;

    public NotificationService(NotificationRepository repo) {
        this.repo = repo;
    }

    public Notification createNotification(Notification n) {
        return repo.save(n);
    }

    public List<Notification> getNotificationsByUser(Long userId) {
        return repo.findByUserId(userId);
    }

    public Notification markAsRead(Long id) {
        Notification n = repo.findById(id).orElseThrow();
        n.setRead(true);
        return repo.save(n);
    }
}