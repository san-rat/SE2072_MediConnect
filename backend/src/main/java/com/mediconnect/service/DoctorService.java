package com.mediconnect.service;

import com.mediconnect.model.DoctorModel;
import java.util.List;

public interface DoctorService {
    DoctorModel saveDoctor(DoctorModel doctor);
    List<DoctorModel> getAllDoctors();
    DoctorModel getDoctorById(String id);
    void deleteDoctor(String id);
}
