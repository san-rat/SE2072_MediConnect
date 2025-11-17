package com.mediconnect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mediconnect.dto.FeedbackCreateDto;
import com.mediconnect.dto.FeedbackResponseDto;
import com.mediconnect.service.FeedbackService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<FeedbackResponseDto> createFeedback(@Valid @RequestBody FeedbackCreateDto feedbackCreateDto) {
        FeedbackResponseDto response = feedbackService.createFeedback(feedbackCreateDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FeedbackResponseDto>> getAllFeedback() {
        List<FeedbackResponseDto> feedbacks = feedbackService.getAllFeedback();
        return new ResponseEntity<>(feedbacks, HttpStatus.OK);
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public ResponseEntity<List<FeedbackResponseDto>> getFeedbackByPatientId(@PathVariable String patientId) {
        List<FeedbackResponseDto> feedbacks = feedbackService.getFeedbackByPatientId(patientId);
        return new ResponseEntity<>(feedbacks, HttpStatus.OK);
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<FeedbackResponseDto>> getFeedbackByDoctorId(@PathVariable String doctorId) {
        List<FeedbackResponseDto> feedbacks = feedbackService.getFeedbackByDoctorId(doctorId);
        return new ResponseEntity<>(feedbacks, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeedbackResponseDto> getFeedbackById(@PathVariable String id) {
        FeedbackResponseDto feedback = feedbackService.getFeedbackById(id);
        return new ResponseEntity<>(feedback, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFeedback(@PathVariable String id) {
        feedbackService.deleteFeedback(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

