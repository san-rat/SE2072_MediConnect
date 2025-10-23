package com.mediconnect.repository;

import com.mediconnect.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Efficient lookup by owning user (uses FK user_id under the hood)
    List<Notification> findAllByUser_IdOrderByCreatedAtDesc(String userId);

    // Existing helpers
    List<Notification> findByUser_EmailContainingIgnoreCase(String email);
    List<Notification> findByUser_FirstNameContainingIgnoreCase(String firstName);
}
