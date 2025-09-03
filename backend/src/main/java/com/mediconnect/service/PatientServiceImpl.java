package com.mediconnect.service;

import com.mediconnect.model.PatientModel;
import com.mediconnect.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    public PatientServiceImpl(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Override
    public PatientModel savePatient(PatientModel patient) {
        return patientRepository.save(patient);
    }

    @Override
    public List<PatientModel> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public PatientModel getPatientById(String id) {
        Optional<PatientModel> patient = patientRepository.findById(id);
        return patient.orElse(null);
    }

    @Override
    public void deletePatient(String id) {
        patientRepository.deleteById(id);
    }
}
