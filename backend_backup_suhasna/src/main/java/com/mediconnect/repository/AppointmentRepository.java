package com.mediconnect.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mediconnect.model.AppointmentModel;
import com.mediconnect.model.DoctorModel;
import com.mediconnect.model.PatientModel;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentModel, String> {

    // Find appointments by patient
    List<AppointmentModel> findByPatientOrderByAppointmentDateDesc(PatientModel patient);

    // Find appointments by doctor
    List<AppointmentModel> findByDoctorOrderByAppointmentDateDesc(DoctorModel doctor);

    // Find appointments by patient and status
    List<AppointmentModel> findByPatientAndStatusOrderByAppointmentDateDesc(PatientModel patient, AppointmentModel.AppointmentStatus status);

    // Find appointments by doctor and status
    List<AppointmentModel> findByDoctorAndStatusOrderByAppointmentDateDesc(DoctorModel doctor, AppointmentModel.AppointmentStatus status);

    // Find appointments by date range
    @Query("SELECT a FROM AppointmentModel a WHERE a.appointmentDate BETWEEN :startDate AND :endDate ORDER BY a.appointmentDate, a.appointmentTime")
    List<AppointmentModel> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Find appointments by doctor and date
    List<AppointmentModel> findByDoctorAndAppointmentDateOrderByAppointmentTime(DoctorModel doctor, LocalDate appointmentDate);

    // Find appointments by patient and date
    List<AppointmentModel> findByPatientAndAppointmentDateOrderByAppointmentTime(PatientModel patient, LocalDate appointmentDate);

    // Check if appointment exists for doctor at specific date and time
    @Query("SELECT a FROM AppointmentModel a WHERE a.doctor = :doctor AND a.appointmentDate = :date AND a.appointmentTime = :time AND a.status IN ('PENDING', 'CONFIRMED')")
    Optional<AppointmentModel> findByDoctorAndDateAndTime(@Param("doctor") DoctorModel doctor, @Param("date") LocalDate date, @Param("time") java.time.LocalTime time);

    // Find upcoming appointments for patient
    @Query("SELECT a FROM AppointmentModel a WHERE a.patient = :patient AND a.appointmentDate >= :today AND a.status IN ('PENDING', 'CONFIRMED') ORDER BY a.appointmentDate, a.appointmentTime")
    List<AppointmentModel> findUpcomingByPatient(@Param("patient") PatientModel patient, @Param("today") LocalDate today);

    // Find past appointments for patient
    @Query("SELECT a FROM AppointmentModel a WHERE a.patient = :patient AND a.appointmentDate < :today ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    List<AppointmentModel> findPastByPatient(@Param("patient") PatientModel patient, @Param("today") LocalDate today);

    // Count appointments by status
    long countByStatus(AppointmentModel.AppointmentStatus status);

    // Find appointments by doctor and date after today
    List<AppointmentModel> findByDoctorAndAppointmentDateAfterOrderByAppointmentDateAscAppointmentTimeAsc(DoctorModel doctor, LocalDate appointmentDate);

    // Find appointments by doctor and date before today
    List<AppointmentModel> findByDoctorAndAppointmentDateBeforeOrderByAppointmentDateDescAppointmentTimeDesc(DoctorModel doctor, LocalDate appointmentDate);
}
