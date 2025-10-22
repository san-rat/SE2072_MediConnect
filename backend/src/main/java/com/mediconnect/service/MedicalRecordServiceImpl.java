package com.mediconnect.service;

import com.mediconnect.dto.MedicalRecordCreateDto;
import com.mediconnect.dto.MedicalRecordResponseDto;
import com.mediconnect.model.DoctorModel;
import com.mediconnect.model.MedicalRecordModel;
import com.mediconnect.model.PatientModel;
import com.mediconnect.model.UserModel;
import com.mediconnect.repository.MedicalRecordRepository;
import com.mediconnect.repository.PatientRepository;
import com.mediconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import com.mediconnect.repository.DoctorRepository;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MedicalRecordServiceImpl implements MedicalRecordService {
    private final MedicalRecordRepository repo;
    private final UserRepository userRepo;
    private final PatientRepository patientRepo;
    private final DoctorRepository doctorRepo;

    public MedicalRecordServiceImpl(MedicalRecordRepository repo, UserRepository userRepo, PatientRepository patientRepo, DoctorRepository doctorRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.patientRepo = patientRepo;
        this.doctorRepo = doctorRepo;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicalRecordResponseDto> getForPatient(String patientEmail) {
        PatientModel patient = patientRepo.findByUserEmail(patientEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found: " + patientEmail));

        return repo.findByPatientOrderByDateDesc(patient).stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicalRecordResponseDto> getForDoctor(String doctorIdentifier) {
        DoctorModel doctor = loadDoctorByIdentifier(doctorIdentifier);
        if (doctor == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found: " + doctorIdentifier);
        }
        return repo.findByDoctorOrderByDateDesc(doctor).stream().map(this::toDto).toList();
    }

    @Override
    @Transactional
    public MedicalRecordResponseDto create(String doctorIdentifier, MedicalRecordCreateDto dto, FileStorageService.StoredFile stored) {
        DoctorModel doctor = loadDoctorByIdentifier(doctorIdentifier);
        if (doctor == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found: " + doctorIdentifier);
        }
        PatientModel patient = patientRepo.findByUserEmail(dto.patientEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found: " + dto.patientEmail));

        MedicalRecordModel entity = new MedicalRecordModel();
        entity.setRecordNumber(dto.recordNumber);
        entity.setDate(dto.date);
        entity.setSummary(dto.summary);
        entity.setFacilityName(dto.facilityName);
        entity.setDoctor(doctor);
        entity.setPatient(patient);

        if (stored != null) {
            entity.setFileName(stored.originalName());
            entity.setStoredName(stored.storedName());
            entity.setFileType(stored.contentType());
            entity.setFileSize(stored.size());
        }

        return toDto(repo.save(entity));
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

    private MedicalRecordResponseDto toDto(MedicalRecordModel m) {
        MedicalRecordResponseDto dto = new MedicalRecordResponseDto();
        dto.id = m.getId();
        dto.recordNumber = m.getRecordNumber();
        dto.date = m.getDate();
        dto.summary = m.getSummary();
        dto.doctorName = (m.getDoctor() != null && m.getDoctor().getUser() != null)
                ? m.getDoctor().getUser().getFirstName() + " " + m.getDoctor().getUser().getLastName()
                : null;
        dto.facilityName = m.getFacilityName();
        dto.patientName = (m.getPatient() != null && m.getPatient().getUser() != null)
                ? m.getPatient().getUser().getFirstName() + " " + m.getPatient().getUser().getLastName()
                : null;
        dto.patientEmail = (m.getPatient() != null && m.getPatient().getUser() != null)
                ? m.getPatient().getUser().getEmail()
                : null;
        dto.fileName = m.getFileName();
        dto.fileType = m.getFileType();
        dto.fileSize = m.getFileSize();
        if (m.getStoredName() != null) {
            String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/files/medical-records/")
                    .path(m.getStoredName())
                    .toUriString();
            dto.fileUrl = url;
        }
        return dto;
    }
}
