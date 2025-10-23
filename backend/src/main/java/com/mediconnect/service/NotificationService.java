package com.mediconnect.service;

import com.mediconnect.model.Notification;
import com.mediconnect.model.UserModel;
import com.mediconnect.repository.NotificationRepository;
import com.mediconnect.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    // Save a notification
    public Notification createNotification(Notification notification, String userId) {
        Optional<UserModel> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new IllegalArgumentException("User not found with ID: " + userId);
        }
        notification.setUser(user.get());
        return notificationRepository.save(notification);
    }

    // Get all notifications
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    // Get notifications by userId
    public List<Notification> getNotificationsByUserId(String userId) {
        return notificationRepository.findAll().stream()
                .filter(n -> n.getUser() != null && n.getUser().getId().equals(userId))
                .toList();
    }

    // Get notifications by user email
    public List<Notification> getNotificationsByEmail(String email) {
        return notificationRepository.findByUser_EmailContainingIgnoreCase(email);
    }

    // Get notifications by user first name
    public List<Notification> getNotificationsByFirstName(String firstName) {
        return notificationRepository.findByUser_FirstNameContainingIgnoreCase(firstName);
    }

    // Mark notification as read
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with ID: " + notificationId));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }
}
