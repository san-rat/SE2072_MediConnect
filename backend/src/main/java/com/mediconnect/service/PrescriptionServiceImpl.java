package com.mediconnect.service;

import com.mediconnect.dto.PrescriptionCreateDto;
import com.mediconnect.dto.PrescriptionResponseDto;
import com.mediconnect.model.*;
import com.mediconnect.repository.PatientRepository;
import com.mediconnect.repository.PrescriptionRepository;
import com.mediconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import com.mediconnect.repository.DoctorRepository;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {
    private final PrescriptionRepository repo;
    private final UserRepository userRepo;
    private final PatientRepository patientRepo;
    private final DoctorRepository doctorRepo;

    public PrescriptionServiceImpl(PrescriptionRepository repo, UserRepository userRepo, PatientRepository patientRepo, DoctorRepository doctorRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.patientRepo = patientRepo;
        this.doctorRepo = doctorRepo;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionResponseDto> getForPatient(String patientEmail) {
        PatientModel patient = patientRepo.findByUserEmail(patientEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found: " + patientEmail));
        return repo.findByPatientOrderByDateDesc(patient).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionResponseDto> getForDoctor(String doctorIdentifier) {
        DoctorModel doctor = loadDoctorByIdentifier(doctorIdentifier);
        if (doctor == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found: " + doctorIdentifier);
        }
        return repo.findByDoctorOrderByDateDesc(doctor).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PrescriptionResponseDto create(String doctorIdentifier, PrescriptionCreateDto dto, FileStorageService.StoredFile stored) {
        DoctorModel doctor = loadDoctorByIdentifier(doctorIdentifier);
        if (doctor == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found: " + doctorIdentifier);
        }
        PatientModel patient = patientRepo.findByUserEmail(dto.patientEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found: " + dto.patientEmail));

        PrescriptionModel entity = new PrescriptionModel();
        entity.setPrescriptionNumber(dto.prescriptionNumber);
        entity.setDoctor(doctor);
        entity.setPatient(patient);
        entity.setDate(dto.date);
        entity.setValidUntil(dto.validUntil);
        entity.setInstructions(dto.instructions);
        entity.setNotes(dto.notes);
        entity.setFacilityName(dto.facilityName);

        if (dto.medications != null) {
            List<PrescriptionModel.PrescriptionMedication> meds = dto.medications.stream().map(m -> {
                PrescriptionModel.PrescriptionMedication em = new PrescriptionModel.PrescriptionMedication();
                em.setName(m.name);
                em.setDosage(m.dosage);
                em.setFrequency(m.frequency);
                em.setDuration(m.duration);
                return em;
            }).toList();
            entity.setMedications(meds);
        } else {
            entity.setMedications(Collections.emptyList());
        }

        if (stored != null) {
            entity.setFileName(stored.originalName());
            entity.setStoredName(stored.storedName());
            entity.setFileType(stored.contentType());
            entity.setFileSize(stored.size());
        }

        PrescriptionModel saved = repo.save(entity);
        return toDto(saved);
    }

    private DoctorModel loadDoctorByIdentifier(String identifier) {
        return doctorRepo.findByUserEmail(identifier)
                .orElseGet(() -> {
                    UserModel user = userRepo.findById(identifier)
                            .orElseGet(() -> userRepo.findByEmail(identifier).orElse(null));
                    if (user == null) {
                        return null;
                    }
                    return doctorRepo.findByUser(user)
                            .orElseGet(() -> doctorRepo.findByUserId(user.getId())
                                    .orElseGet(() -> doctorRepo.findByUserEmail(user.getEmail()).orElse(null)));
                });
    }

    private PrescriptionResponseDto toDto(PrescriptionModel p) {
        PrescriptionResponseDto dto = new PrescriptionResponseDto();
        dto.id = p.getId();
        dto.prescriptionNumber = p.getPrescriptionNumber();
        dto.date = p.getDate();
        dto.validUntil = p.getValidUntil();
        dto.instructions = p.getInstructions();
        dto.notes = p.getNotes();
        dto.doctorName = (p.getDoctor() != null && p.getDoctor().getUser() != null)
                ? p.getDoctor().getUser().getFirstName() + " " + p.getDoctor().getUser().getLastName()
                : null;
        dto.facilityName = p.getFacilityName();
        dto.patientName = (p.getPatient() != null && p.getPatient().getUser() != null)
                ? p.getPatient().getUser().getFirstName() + " " + p.getPatient().getUser().getLastName()
                : null;
        dto.patientEmail = (p.getPatient() != null && p.getPatient().getUser() != null)
                ? p.getPatient().getUser().getEmail()
                : null;
        dto.medications = p.getMedications() == null ? Collections.emptyList() : p.getMedications().stream().map(m -> {
            PrescriptionCreateDto.MedicationDto md = new PrescriptionCreateDto.MedicationDto();
            md.name = m.getName();
            md.dosage = m.getDosage();
            md.frequency = m.getFrequency();
            md.duration = m.getDuration();
            return md;
        }).toList();
        dto.fileName = p.getFileName();
        dto.fileType = p.getFileType();
        dto.fileSize = p.getFileSize();
        if (p.getStoredName() != null) {
            String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/files/prescriptions/")
                    .path(p.getStoredName())
                    .toUriString();
            dto.fileUrl = url;
        }
        return dto;
    }
}
