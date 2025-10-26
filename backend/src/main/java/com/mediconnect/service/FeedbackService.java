package com.mediconnect.service;

import com.mediconnect.dto.FeedbackCreateDto;
import com.mediconnect.dto.FeedbackResponseDto;

import java.util.List;

public interface FeedbackService {
    FeedbackResponseDto createFeedback(FeedbackCreateDto feedbackCreateDto);
    List<FeedbackResponseDto> getFeedbackByPatientId(String patientId);
    List<FeedbackResponseDto> getFeedbackByDoctorId(String doctorId);
    List<FeedbackResponseDto> getAllFeedback();
    FeedbackResponseDto getFeedbackById(String id);
    void deleteFeedback(String id);
}

