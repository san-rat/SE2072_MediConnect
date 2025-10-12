package com.mediconnect.repository;

import com.mediconnect.model.PatientModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<PatientModel, String> {
    Optional<PatientModel> findByUserId(String userId);
}
