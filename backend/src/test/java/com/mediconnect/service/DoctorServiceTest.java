package com.mediconnect.service;

import com.mediconnect.model.DoctorModel;
import com.mediconnect.repository.DoctorRepository;
import com.mediconnect.service.DoctorServiceImpl; 

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class DoctorServiceTest {

    @Mock private DoctorRepository doctorRepository;
    @InjectMocks private DoctorServiceImpl doctorService;

    @Test
    void addDoctor_savesAndReturns() {
        DoctorModel d = new DoctorModel();
        d.setId("d1");
        d.setSpecialization("Cardiology");

        Mockito.when(doctorRepository.save(d)).thenReturn(d);

        DoctorModel out = doctorService.saveDoctor(d); // or addDoctor(..) – match your impl
        Assertions.assertNotNull(out);
        Assertions.assertEquals("Cardiology", out.getSpecialization());
    }

    @Test
    void getDoctorById_success() {
        DoctorModel d = new DoctorModel();
        d.setId("d1");
        Mockito.when(doctorRepository.findById("d1")).thenReturn(Optional.of(d));

        DoctorModel out = doctorService.getDoctorById("d1"); // match your impl name
        Assertions.assertEquals("d1", out.getId());
    }

    @Test
    void getDoctorById_notFound() {
        Mockito.when(doctorRepository.findById("nope")).thenReturn(Optional.empty());

        DoctorModel result = doctorService.getDoctorById("nope");
        Assertions.assertNull(result); // Implementation returns null, not exception
    }
}