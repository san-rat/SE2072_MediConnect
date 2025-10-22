package com.mediconnect.repository;

import com.mediconnect.model.PrescriptionModel;
import com.mediconnect.model.DoctorModel;
import com.mediconnect.model.PatientModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionRepository extends JpaRepository<PrescriptionModel, String> {
    List<PrescriptionModel> findByPatientOrderByDateDesc(PatientModel patient);
    List<PrescriptionModel> findByDoctorOrderByDateDesc(DoctorModel doctor);
}
