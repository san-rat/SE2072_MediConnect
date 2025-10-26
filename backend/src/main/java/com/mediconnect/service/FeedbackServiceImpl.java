package com.mediconnect.service;

import com.mediconnect.dto.FeedbackCreateDto;
import com.mediconnect.dto.FeedbackResponseDto;
import com.mediconnect.exception.ResourceNotFoundException;
import com.mediconnect.model.PatientModel;
import com.mediconnect.model.DoctorModel;
import com.mediconnect.model.UserModel;
import com.mediconnect.model.FeedbackModel;
import com.mediconnect.repository.FeedbackRepository;
import com.mediconnect.repository.PatientRepository;
import com.mediconnect.repository.DoctorRepository;
import com.mediconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public FeedbackResponseDto createFeedback(FeedbackCreateDto feedbackCreateDto) {
        // Verify patient exists
        PatientModel patient = patientRepository.findById(feedbackCreateDto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", feedbackCreateDto.getPatientId()));

        FeedbackModel feedback = new FeedbackModel();
        feedback.setPatient(patient);
        feedback.setRating(feedbackCreateDto.getRating());
        feedback.setComment(feedbackCreateDto.getComment());

        // Set doctor if provided
        if (feedbackCreateDto.getDoctorId() != null && !feedbackCreateDto.getDoctorId().isEmpty()) {
            DoctorModel doctor = doctorRepository.findById(feedbackCreateDto.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", feedbackCreateDto.getDoctorId()));
            feedback.setDoctor(doctor);
        }

        feedback = feedbackRepository.save(feedback);
        return convertToDto(feedback);
    }

    @Override
    public List<FeedbackResponseDto> getFeedbackByPatientId(String patientId) {
        List<FeedbackModel> feedbacks = feedbackRepository.findByPatientId(patientId);
        return feedbacks.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FeedbackResponseDto> getFeedbackByDoctorId(String doctorId) {
        List<FeedbackModel> feedbacks = feedbackRepository.findByDoctorId(doctorId);
        return feedbacks.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FeedbackResponseDto> getAllFeedback() {
        List<FeedbackModel> feedbacks = feedbackRepository.findAllByOrderByCreatedAtDesc();
        return feedbacks.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public FeedbackResponseDto getFeedbackById(String id) {
        FeedbackModel feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback", "id", id));
        return convertToDto(feedback);
    }

    @Override
    @Transactional
    public void deleteFeedback(String id) {
        if (!feedbackRepository.existsById(id)) {
            throw new ResourceNotFoundException("Feedback", "id", id);
        }
        feedbackRepository.deleteById(id);
    }

    private FeedbackResponseDto convertToDto(FeedbackModel feedback) {
        FeedbackResponseDto dto = new FeedbackResponseDto();
        dto.setId(feedback.getId());
        dto.setPatientId(feedback.getPatient().getId());
        dto.setRating(feedback.getRating());
        dto.setComment(feedback.getComment());
        dto.setCreatedAt(feedback.getCreatedAt());

        // Get patient user name
        UserModel patientUser = feedback.getPatient().getUser();
        if (patientUser != null) {
            dto.setPatientName(patientUser.getFirstName() + " " + patientUser.getLastName());
        }

        // Get doctor info if present
        if (feedback.getDoctor() != null) {
            dto.setDoctorId(feedback.getDoctor().getId());
            dto.setSpecialization(feedback.getDoctor().getSpecialization());

            UserModel doctorUser = feedback.getDoctor().getUser();
            if (doctorUser != null) {
                dto.setDoctorName(doctorUser.getFirstName() + " " + doctorUser.getLastName());
            }
        }

        return dto;
    }
}
