package com.mediconnect.service;

import com.mediconnect.model.DoctorModel;
import com.mediconnect.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorServiceImpl(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Override
    public DoctorModel saveDoctor(DoctorModel doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    public List<DoctorModel> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public DoctorModel getDoctorById(String id) {
        Optional<DoctorModel> doctor = doctorRepository.findById(id);
        return doctor.orElse(null);
    }

    @Override
    public void deleteDoctor(String id) {
        doctorRepository.deleteById(id);
    }
}
