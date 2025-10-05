package com.mediconnect.service;

import com.mediconnect.model.PatientModel;
import com.mediconnect.repository.PatientRepository;
import com.mediconnect.service.PatientServiceImpl; 

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock private PatientRepository patientRepository;
    @InjectMocks private PatientServiceImpl patientService;

    @Test
    void getPatientById_success() {
        PatientModel p = new PatientModel();
        p.setId("p1");
        Mockito.when(patientRepository.findById("p1")).thenReturn(Optional.of(p));

        PatientModel out = patientService.getPatientById("p1");

        Assertions.assertNotNull(out);
        Assertions.assertEquals("p1", out.getId());
    }

    @Test
    void getPatientById_notFound() {
        Mockito.when(patientRepository.findById("nope")).thenReturn(Optional.empty());

        PatientModel result = patientService.getPatientById("nope");
        Assertions.assertNull(result); // Implementation returns null, not exception
    }
}