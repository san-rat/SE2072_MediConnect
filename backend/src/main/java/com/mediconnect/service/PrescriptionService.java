package com.mediconnect.service;

import com.mediconnect.model.Prescription;
import com.mediconnect.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class PrescriptionService {

    private final PrescriptionRepository repository;
    private final FileStorageService storage;

    public PrescriptionService(PrescriptionRepository repository, FileStorageService storage) {
        this.repository = repository;
        this.storage = storage;
    }

    // ✅ Upload prescription (Doctor flow)
    public Prescription uploadPrescription(MultipartFile file,
                                           String patientId,
                                           String doctorId,
                                           String notes,
                                           String appointmentId) {

        // Save file to disk
        String storedPath = storage.storePrescriptionFile(file, patientId, doctorId);

        // Build entity
        Prescription prescription = new Prescription();
        prescription.setId(UUID.randomUUID().toString());
        prescription.setPatientId(patientId);
        prescription.setDoctorId(doctorId);
        prescription.setNotes(notes);
        prescription.setAppointmentId(appointmentId);
        prescription.setFileUrl(storedPath);
        prescription.setPrescriptionDate(Instant.now()); // ✅ FIXED

        // Save to DB
        return repository.save(prescription);
    }

    // ✅ List prescriptions by patient
    public List<Prescription> listByPatient(String patientId) {
        return repository.findByPatientIdOrderByPrescriptionDateDesc(patientId); // ✅ FIXED
    }

    // ✅ List prescriptions by doctor
    public List<Prescription> listByDoctor(String doctorId) {
        return repository.findByDoctorIdOrderByPrescriptionDateDesc(doctorId); // ✅ FIXED
    }

    // ✅ Get prescription by ID
    public Prescription get(String id) {
        return repository.findById(id).orElse(null);
    }
}
