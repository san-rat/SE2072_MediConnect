package com.mediconnect.service;

import com.mediconnect.model.PatientModel;
import java.util.List;

public interface PatientService {
    PatientModel savePatient(PatientModel patient);
    List<PatientModel> getAllPatients();
    PatientModel getPatientById(String id);
    PatientModel findByUserId(String userId);
    void deletePatient(String id);
}
