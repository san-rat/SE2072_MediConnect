package com.mediconnect.repository;

import com.mediconnect.model.MedicalRecordModel;
import com.mediconnect.model.DoctorModel;
import com.mediconnect.model.PatientModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecordModel, Long> {
    List<MedicalRecordModel> findByPatientOrderByDateDesc(PatientModel patient);
    List<MedicalRecordModel> findByDoctorOrderByDateDesc(DoctorModel doctor);
}
