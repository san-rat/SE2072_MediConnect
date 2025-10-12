package com.mediconnect.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mediconnect.model.DoctorModel;
import com.mediconnect.model.TimeSlotModel;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlotModel, String> {

    // Find time slots by doctor
    List<TimeSlotModel> findByDoctorOrderBySlotDateAscStartTimeAsc(DoctorModel doctor);

    // Find time slots by doctor and date
    List<TimeSlotModel> findByDoctorAndSlotDateOrderByStartTime(DoctorModel doctor, LocalDate slotDate);

    // Find available time slots by doctor and date
    List<TimeSlotModel> findByDoctorAndSlotDateAndIsAvailableTrueAndIsBookedFalseOrderByStartTime(DoctorModel doctor, LocalDate slotDate);

    // Find available time slots by doctor and date range
    @Query("SELECT ts FROM TimeSlotModel ts WHERE ts.doctor = :doctor AND ts.slotDate BETWEEN :startDate AND :endDate AND ts.isAvailable = true AND ts.isBooked = false ORDER BY ts.slotDate, ts.startTime")
    List<TimeSlotModel> findAvailableByDoctorAndDateRange(@Param("doctor") DoctorModel doctor, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Find time slot by doctor, date, and time
    Optional<TimeSlotModel> findByDoctorAndSlotDateAndStartTime(DoctorModel doctor, LocalDate slotDate, LocalTime startTime);

    // Find all available time slots for a date
    List<TimeSlotModel> findBySlotDateAndIsAvailableTrueAndIsBookedFalseOrderByStartTime(LocalDate slotDate);

    // Find time slots by date range
    @Query("SELECT ts FROM TimeSlotModel ts WHERE ts.slotDate BETWEEN :startDate AND :endDate AND ts.isAvailable = true AND ts.isBooked = false ORDER BY ts.slotDate, ts.startTime")
    List<TimeSlotModel> findAvailableByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Check if time slot exists and is available
    @Query("SELECT COUNT(ts) > 0 FROM TimeSlotModel ts WHERE ts.doctor = :doctor AND ts.slotDate = :date AND ts.startTime = :startTime AND ts.isAvailable = true AND ts.isBooked = false")
    boolean existsAvailableSlot(@Param("doctor") DoctorModel doctor, @Param("date") LocalDate date, @Param("startTime") LocalTime startTime);

    // Find time slots by doctor and specialization (through doctor)
    @Query("SELECT ts FROM TimeSlotModel ts WHERE ts.doctor.specialization = :specialization AND ts.slotDate = :date AND ts.isAvailable = true AND ts.isBooked = false ORDER BY ts.startTime")
    List<TimeSlotModel> findAvailableBySpecializationAndDate(@Param("specialization") String specialization, @Param("date") LocalDate date);

    // Count available slots for doctor on specific date
    @Query("SELECT COUNT(ts) FROM TimeSlotModel ts WHERE ts.doctor = :doctor AND ts.slotDate = :date AND ts.isAvailable = true AND ts.isBooked = false")
    long countAvailableSlotsByDoctorAndDate(@Param("doctor") DoctorModel doctor, @Param("date") LocalDate date);
}
