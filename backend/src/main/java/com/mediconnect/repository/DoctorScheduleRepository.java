package com.mediconnect.repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mediconnect.model.DoctorModel;
import com.mediconnect.model.DoctorScheduleModel;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorScheduleModel, String> {

    // Find schedules by doctor
    List<DoctorScheduleModel> findByDoctorOrderByDayOfWeek(DoctorModel doctor);

    // Find schedules by doctor and day of week
    Optional<DoctorScheduleModel> findByDoctorAndDayOfWeek(DoctorModel doctor, DayOfWeek dayOfWeek);

    // Find available schedules by doctor
    List<DoctorScheduleModel> findByDoctorAndIsAvailableTrueOrderByDayOfWeek(DoctorModel doctor);

    // Find schedules by day of week
    List<DoctorScheduleModel> findByDayOfWeekAndIsAvailableTrueOrderByStartTime(DayOfWeek dayOfWeek);

    // Find all available schedules
    List<DoctorScheduleModel> findByIsAvailableTrueOrderByDayOfWeekAscStartTimeAsc();

    // Check if doctor has schedule for specific day
    @Query("SELECT COUNT(ds) > 0 FROM DoctorScheduleModel ds WHERE ds.doctor = :doctor AND ds.dayOfWeek = :dayOfWeek AND ds.isAvailable = true")
    boolean existsByDoctorAndDayOfWeekAndIsAvailable(@Param("doctor") DoctorModel doctor, @Param("dayOfWeek") DayOfWeek dayOfWeek);

    // Find doctors available on specific day
    @Query("SELECT ds.doctor FROM DoctorScheduleModel ds WHERE ds.dayOfWeek = :dayOfWeek AND ds.isAvailable = true")
    List<DoctorModel> findDoctorsAvailableOnDay(@Param("dayOfWeek") DayOfWeek dayOfWeek);
}
