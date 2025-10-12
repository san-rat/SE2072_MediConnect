package com.mediconnect.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediconnect.dto.AppointmentResponseDto;
import com.mediconnect.dto.BookAppointmentDto;
import com.mediconnect.exception.ResourceNotFoundException;
import com.mediconnect.model.AppointmentModel;
import com.mediconnect.model.DoctorModel;
import com.mediconnect.model.PatientModel;
import com.mediconnect.model.TimeSlotModel;
import com.mediconnect.model.UserModel;
import com.mediconnect.repository.AppointmentRepository;
import com.mediconnect.repository.DoctorRepository;
import com.mediconnect.repository.PatientRepository;
import com.mediconnect.repository.TimeSlotRepository;

@Service
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Autowired
    private UserService userService;

    @Override
    public AppointmentResponseDto bookAppointment(BookAppointmentDto bookAppointmentDto, String patientId) {
        // Find patient
        PatientModel patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        // Find doctor
        DoctorModel doctor = doctorRepository.findById(bookAppointmentDto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", bookAppointmentDto.getDoctorId()));

        // Check if appointment slot is available
        if (!isAppointmentAvailable(bookAppointmentDto.getDoctorId(), bookAppointmentDto.getAppointmentDate(), bookAppointmentDto.getAppointmentTime().toString())) {
            throw new RuntimeException("Appointment slot is not available");
        }

        // Create new appointment
        AppointmentModel appointment = new AppointmentModel();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(bookAppointmentDto.getAppointmentDate());
        appointment.setAppointmentTime(bookAppointmentDto.getAppointmentTime());
        appointment.setDurationMinutes(30); // Default 30 minutes
        appointment.setStatus(AppointmentModel.AppointmentStatus.PENDING);
        appointment.setConsultationFee(doctor.getConsultationFee());
        appointment.setNotes(bookAppointmentDto.getNotes());

        // Save appointment
        AppointmentModel savedAppointment = appointmentRepository.save(appointment);

        // Mark time slot as booked
        TimeSlotModel timeSlot = timeSlotRepository.findByDoctorAndSlotDateAndStartTime(
                doctor, bookAppointmentDto.getAppointmentDate(), bookAppointmentDto.getAppointmentTime())
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", "id", "not found"));
        
        timeSlot.setIsBooked(true);
        timeSlotRepository.save(timeSlot);

        return convertToResponseDto(savedAppointment);
    }

    @Override
    public AppointmentResponseDto bookAppointmentByEmail(BookAppointmentDto bookAppointmentDto, String userEmail) {
        // Find user by email first
        UserModel user = userService.findByEmail(userEmail);
        if (user == null) {
            throw new ResourceNotFoundException("User", "email", userEmail);
        }
        
        // Find patient by user ID
        PatientModel patient = patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "user_id", user.getId()));

        // Use the existing bookAppointment method with the patient ID
        return bookAppointment(bookAppointmentDto, patient.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getAppointmentsByPatient(String patientId) {
        PatientModel patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        List<AppointmentModel> appointments = appointmentRepository.findByPatientOrderByAppointmentDateDesc(patient);
        return appointments.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getUpcomingAppointmentsByPatient(String userId) {
        // Find patient by user ID
        PatientModel patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "user_id", userId));

        List<AppointmentModel> appointments = appointmentRepository.findUpcomingByPatient(patient, LocalDate.now());
        return appointments.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getUpcomingAppointmentsByPatientEmail(String userEmail) {
        // Find user by email first
        UserModel user = userService.findByEmail(userEmail);
        if (user == null) {
            throw new ResourceNotFoundException("User", "email", userEmail);
        }
        
        // Find patient by user ID
        PatientModel patient = patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "user_id", user.getId()));

        List<AppointmentModel> appointments = appointmentRepository.findUpcomingByPatient(patient, LocalDate.now());
        return appointments.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getPastAppointmentsByPatient(String userId) {
        // Find patient by user ID
        PatientModel patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "user_id", userId));

        List<AppointmentModel> appointments = appointmentRepository.findPastByPatient(patient, LocalDate.now());
        return appointments.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getPastAppointmentsByPatientEmail(String userEmail) {
        // Find user by email first
        UserModel user = userService.findByEmail(userEmail);
        if (user == null) {
            throw new ResourceNotFoundException("User", "email", userEmail);
        }
        
        // Find patient by user ID
        PatientModel patient = patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "user_id", user.getId()));

        List<AppointmentModel> appointments = appointmentRepository.findPastByPatient(patient, LocalDate.now());
        return appointments.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getAppointmentsByDoctor(String doctorId) {
        DoctorModel doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        List<AppointmentModel> appointments = appointmentRepository.findByDoctorOrderByAppointmentDateDesc(doctor);
        return appointments.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentResponseDto getAppointmentById(String appointmentId) {
        AppointmentModel appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));

        return convertToResponseDto(appointment);
    }

    @Override
    public AppointmentResponseDto updateAppointmentStatus(String appointmentId, AppointmentModel.AppointmentStatus status) {
        AppointmentModel appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));

        appointment.setStatus(status);
        AppointmentModel updatedAppointment = appointmentRepository.save(appointment);

        return convertToResponseDto(updatedAppointment);
    }

    @Override
    public AppointmentResponseDto cancelAppointment(String appointmentId) {
        AppointmentModel appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));

        appointment.setStatus(AppointmentModel.AppointmentStatus.CANCELLED);
        AppointmentModel updatedAppointment = appointmentRepository.save(appointment);

        // Free up the time slot
        TimeSlotModel timeSlot = timeSlotRepository.findByDoctorAndSlotDateAndStartTime(
                appointment.getDoctor(), appointment.getAppointmentDate(), appointment.getAppointmentTime())
                .orElse(null);
        
        if (timeSlot != null) {
            timeSlot.setIsBooked(false);
            timeSlotRepository.save(timeSlot);
        }

        return convertToResponseDto(updatedAppointment);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isAppointmentAvailable(String doctorId, LocalDate date, String time) {
        DoctorModel doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        LocalTime appointmentTime = LocalTime.parse(time);
        
        // Check if time slot exists and is available
        return timeSlotRepository.existsAvailableSlot(doctor, date, appointmentTime);
    }

    @Override
    @Transactional(readOnly = true)
    public long getAppointmentCountByStatus(AppointmentModel.AppointmentStatus status) {
        return appointmentRepository.countByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getTodayAppointmentsByDoctor(String doctorId) {
        DoctorModel doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        LocalDate today = LocalDate.now();
        List<AppointmentModel> appointments = appointmentRepository.findByDoctorAndAppointmentDateOrderByAppointmentTime(doctor, today);
        
        return appointments.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getTomorrowAppointmentsByDoctor(String doctorId) {
        DoctorModel doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<AppointmentModel> appointments = appointmentRepository.findByDoctorAndAppointmentDateOrderByAppointmentTime(doctor, tomorrow);
        
        return appointments.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getUpcomingAppointmentsByDoctor(String doctorId) {
        DoctorModel doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        LocalDate today = LocalDate.now();
        List<AppointmentModel> appointments = appointmentRepository.findByDoctorAndAppointmentDateAfterOrderByAppointmentDateAscAppointmentTimeAsc(doctor, today);
        
        return appointments.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getPastAppointmentsByDoctor(String doctorId) {
        DoctorModel doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        LocalDate today = LocalDate.now();
        List<AppointmentModel> appointments = appointmentRepository.findByDoctorAndAppointmentDateBeforeOrderByAppointmentDateDescAppointmentTimeDesc(doctor, today);
        
        return appointments.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    private AppointmentResponseDto convertToResponseDto(AppointmentModel appointment) {
        AppointmentResponseDto dto = new AppointmentResponseDto();
        dto.setId(appointment.getId());
        dto.setDoctorId(appointment.getDoctor().getId());
        dto.setDoctorName(appointment.getDoctor().getUser().getFirstName() + " " + appointment.getDoctor().getUser().getLastName());
        dto.setDoctorSpecialization(appointment.getDoctor().getSpecialization());
        dto.setPatientId(appointment.getPatient().getId());
        dto.setPatientName(appointment.getPatient().getUser().getFirstName() + " " + appointment.getPatient().getUser().getLastName());
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setAppointmentTime(appointment.getAppointmentTime());
        dto.setDurationMinutes(appointment.getDurationMinutes());
        dto.setStatus(appointment.getStatus());
        dto.setConsultationFee(appointment.getConsultationFee());
        dto.setNotes(appointment.getNotes());
        dto.setCreatedAt(appointment.getCreatedAt());
        dto.setUpdatedAt(appointment.getUpdatedAt());
        return dto;
    }
}
