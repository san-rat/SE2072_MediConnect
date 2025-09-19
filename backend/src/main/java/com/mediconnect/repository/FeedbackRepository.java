package com.mediconnect.repository;

import com.mediconnect.model.FeedbackModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<FeedbackModel, String> {
    List<FeedbackModel> findByPatientId(String patientId);
    List<FeedbackModel> findByDoctorId(String doctorId);
    List<FeedbackModel> findAllByOrderByCreatedAtDesc();
}
