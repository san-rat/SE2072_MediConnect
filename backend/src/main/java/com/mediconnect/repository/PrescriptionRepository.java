package com.mediconnect.repository;

import com.mediconnect.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, String> {

  // ✅ Get prescriptions for a patient, newest first
  List<Prescription> findByPatientIdOrderByPrescriptionDateDesc(String patientId);

  // ✅ Get prescriptions for a doctor, newest first
  List<Prescription> findByDoctorIdOrderByPrescriptionDateDesc(String doctorId);
}
