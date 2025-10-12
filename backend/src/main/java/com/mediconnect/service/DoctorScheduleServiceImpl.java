package com.mediconnect.service;

import com.mediconnect.model.DoctorModel;
import com.mediconnect.model.DoctorScheduleModel;
import com.mediconnect.repository.DoctorRepository;
import com.mediconnect.repository.DoctorScheduleRepository;
import com.mediconnect.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional
public class DoctorScheduleServiceImpl implements DoctorScheduleService {

    @Autowired
    private DoctorScheduleRepository doctorScheduleRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public void createDefaultScheduleForDoctor(String doctorId) {
        DoctorModel doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        // Create schedule for Monday to Friday, 8 AM to 5 PM
        DayOfWeek[] workingDays = {DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY};
        LocalTime startTime = LocalTime.of(8, 0); // 8:00 AM
        LocalTime endTime = LocalTime.of(17, 0); // 5:00 PM

        for (DayOfWeek day : workingDays) {
            // Check if schedule already exists
            if (doctorScheduleRepository.findByDoctorAndDayOfWeek(doctor, day).isEmpty()) {
                DoctorScheduleModel schedule = new DoctorScheduleModel();
                schedule.setDoctor(doctor);
                schedule.setDayOfWeek(day);
                schedule.setStartTime(startTime);
                schedule.setEndTime(endTime);
                schedule.setIsAvailable(true);
                schedule.setSlotDurationMinutes(30); // 30-minute slots

                doctorScheduleRepository.save(schedule);
            }
        }
    }

    @Override
    public void createDefaultSchedulesForAllDoctors() {
        List<DoctorModel> doctors = doctorRepository.findAll();
        for (DoctorModel doctor : doctors) {
            createDefaultScheduleForDoctor(doctor.getId());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorScheduleModel> getScheduleForDoctor(String doctorId) {
        DoctorModel doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        return doctorScheduleRepository.findByDoctorOrderByDayOfWeek(doctor);
    }

    @Override
    public DoctorScheduleModel updateDoctorSchedule(String scheduleId, LocalTime startTime, LocalTime endTime, boolean isAvailable) {
        DoctorScheduleModel schedule = doctorScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("DoctorSchedule", "id", scheduleId));

        schedule.setStartTime(startTime);
        schedule.setEndTime(endTime);
        schedule.setIsAvailable(isAvailable);

        return doctorScheduleRepository.save(schedule);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isDoctorAvailableOnDay(String doctorId, DayOfWeek dayOfWeek) {
        DoctorModel doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        return doctorScheduleRepository.existsByDoctorAndDayOfWeekAndIsAvailable(doctor, dayOfWeek);
    }
}
