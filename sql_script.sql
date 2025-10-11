-- =====================================================
-- MediConnect Doctor Appointments Complete Setup
-- =====================================================
-- This script creates all necessary tables and populates them
-- with comprehensive test data for the doctor appointments system
-- =====================================================

USE MediConnect;

-- =====================================================
-- 1. CREATE TABLES (IF NOT EXISTS)
-- =====================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) NOT NULL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    id CHAR(36) NOT NULL PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    date_of_birth DATE,
    emergency_contact VARCHAR(100),
    blood_group VARCHAR(10),
    medical_history TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patient_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id CHAR(36) NOT NULL PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    years_experience INT DEFAULT 0,
    consultation_fee DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doctor_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_specialization (specialization)
) ENGINE=InnoDB;

-- Doctor schedules table
CREATE TABLE IF NOT EXISTS doctor_schedules (
    id CHAR(36) NOT NULL PRIMARY KEY,
    doctor_id CHAR(36) NOT NULL,
    day_of_week ENUM('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    slot_duration_minutes INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_schedule_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    UNIQUE KEY uq_doctor_day (doctor_id, day_of_week),
    INDEX idx_doctor_day (doctor_id, day_of_week)
) ENGINE=InnoDB;

-- Time slots table
CREATE TABLE IF NOT EXISTS time_slots (
    id CHAR(36) NOT NULL PRIMARY KEY,
    doctor_id CHAR(36) NOT NULL,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    is_booked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_slot_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    UNIQUE KEY uq_slot_unique (doctor_id, slot_date, start_time),
    INDEX idx_doctor_date (doctor_id, slot_date),
    INDEX idx_date_available (slot_date, is_available, is_booked)
) ENGINE=InnoDB;

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id CHAR(36) NOT NULL PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    doctor_id CHAR(36) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INT DEFAULT 30,
    status ENUM('PENDING','CONFIRMED','COMPLETED','CANCELLED','NO_SHOW') DEFAULT 'PENDING',
    consultation_fee DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_appt_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_appt_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    INDEX idx_doctor_date (doctor_id, appointment_date),
    INDEX idx_patient_date (patient_id, appointment_date),
    INDEX idx_status (status),
    INDEX idx_date_time (appointment_date, appointment_time)
) ENGINE=InnoDB;

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id CHAR(36) NOT NULL PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    role_level ENUM('ADMIN','SUPER_ADMIN') DEFAULT 'ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_admin_user (user_id)
) ENGINE=InnoDB;

-- =====================================================
-- 2. INSERT TEST USERS
-- =====================================================

-- Clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM appointments;
-- DELETE FROM time_slots;
-- DELETE FROM doctor_schedules;
-- DELETE FROM doctors;
-- DELETE FROM patients;
-- DELETE FROM admins;
-- DELETE FROM users;

-- Insert test users
INSERT INTO users (id, first_name, last_name, email, password, phone, is_active, created_at) VALUES
-- Patients
('user-001', 'John', 'Smith', 'john.smith@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567890', TRUE, NOW()),
('user-002', 'Sarah', 'Johnson', 'sarah.johnson@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567891', TRUE, NOW()),
('user-003', 'Michael', 'Chen', 'michael.chen@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567892', TRUE, NOW()),
('user-004', 'Emily', 'Davis', 'emily.davis@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567893', TRUE, NOW()),
('user-005', 'David', 'Wilson', 'david.wilson@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567894', TRUE, NOW()),

-- Doctors
('user-006', 'Dr. Emily', 'Davis', 'emily.davis@hospital.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567895', TRUE, NOW()),
('user-007', 'Dr. Robert', 'Wilson', 'robert.wilson@hospital.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567896', TRUE, NOW()),
('user-008', 'Dr. Lisa', 'Anderson', 'lisa.anderson@hospital.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567897', TRUE, NOW()),
('user-009', 'Dr. James', 'Brown', 'james.brown@hospital.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567898', TRUE, NOW()),
('user-010', 'Dr. Maria', 'Garcia', 'maria.garcia@hospital.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567899', TRUE, NOW()),

-- Admin
('user-011', 'Admin', 'User', 'admin@mediconnect.com', '$2a$10$ES2oW5fgYllm0ouojBiPieZ3HTmXESrwamv5NoCCksBiDSxuEkyQ2', '+1234567000', TRUE, NOW())
ON DUPLICATE KEY UPDATE
    first_name = VALUES(first_name),
    last_name = VALUES(last_name),
    password = VALUES(password),
    phone = VALUES(phone),
    is_active = VALUES(is_active),
    updated_at = NOW();

-- =====================================================
-- 3. INSERT TEST PATIENTS
-- =====================================================

INSERT INTO patients (id, user_id, date_of_birth, emergency_contact, blood_group, medical_history, created_at) VALUES
('patient-001', 'user-001', '1985-03-15', 'Jane Smith (+1234567890)', 'A+', 'No significant medical history', NOW()),
('patient-002', 'user-002', '1990-07-22', 'Tom Johnson (+1234567891)', 'B+', 'Allergic to penicillin', NOW()),
('patient-003', 'user-003', '1988-11-08', 'Linda Chen (+1234567892)', 'O+', 'Diabetes type 2', NOW()),
('patient-004', 'user-004', '1992-05-12', 'Mark Davis (+1234567893)', 'AB+', 'Hypertension', NOW()),
('patient-005', 'user-005', '1987-09-30', 'Susan Wilson (+1234567894)', 'A-', 'Asthma', NOW())
ON DUPLICATE KEY UPDATE
    date_of_birth = VALUES(date_of_birth),
    emergency_contact = VALUES(emergency_contact),
    blood_group = VALUES(blood_group),
    medical_history = VALUES(medical_history);

-- =====================================================
-- 4. INSERT TEST DOCTORS
-- =====================================================

INSERT INTO doctors (id, user_id, specialization, license_number, years_experience, consultation_fee, created_at) VALUES
('doctor-001', 'user-006', 'Cardiology', 'LIC-CARD-001', 12, 150.00, NOW()),
('doctor-002', 'user-007', 'Neurology', 'LIC-NEUR-002', 8, 180.00, NOW()),
('doctor-003', 'user-008', 'Pediatrics', 'LIC-PED-003', 15, 120.00, NOW()),
('doctor-004', 'user-009', 'General Medicine', 'LIC-GEN-004', 10, 100.00, NOW()),
('doctor-005', 'user-010', 'Dermatology', 'LIC-DERM-005', 6, 130.00, NOW())
ON DUPLICATE KEY UPDATE
    specialization = VALUES(specialization),
    license_number = VALUES(license_number),
    years_experience = VALUES(years_experience),
    consultation_fee = VALUES(consultation_fee);

-- =====================================================
-- 5. INSERT ADMIN
-- =====================================================

INSERT INTO admins (id, user_id, role_level, created_at) VALUES
('admin-001', 'user-011', 'ADMIN', NOW())
ON DUPLICATE KEY UPDATE
    role_level = VALUES(role_level);

-- =====================================================
-- 6. INSERT DOCTOR SCHEDULES
-- =====================================================

-- Dr. Emily Davis (Cardiology) - Monday to Friday, 8 AM to 5 PM
INSERT INTO doctor_schedules (id, doctor_id, day_of_week, start_time, end_time, is_available, slot_duration_minutes, created_at) VALUES
('schedule-001', 'doctor-001', 'MONDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-002', 'doctor-001', 'TUESDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-003', 'doctor-001', 'WEDNESDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-004', 'doctor-001', 'THURSDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-005', 'doctor-001', 'FRIDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),

-- Dr. Robert Wilson (Neurology) - Monday to Friday, 9 AM to 6 PM
('schedule-006', 'doctor-002', 'MONDAY', '09:00:00', '18:00:00', TRUE, 30, NOW()),
('schedule-007', 'doctor-002', 'TUESDAY', '09:00:00', '18:00:00', TRUE, 30, NOW()),
('schedule-008', 'doctor-002', 'WEDNESDAY', '09:00:00', '18:00:00', TRUE, 30, NOW()),
('schedule-009', 'doctor-002', 'THURSDAY', '09:00:00', '18:00:00', TRUE, 30, NOW()),
('schedule-010', 'doctor-002', 'FRIDAY', '09:00:00', '18:00:00', TRUE, 30, NOW()),

-- Dr. Lisa Anderson (Pediatrics) - Monday to Friday, 8 AM to 4 PM
('schedule-011', 'doctor-003', 'MONDAY', '08:00:00', '16:00:00', TRUE, 30, NOW()),
('schedule-012', 'doctor-003', 'TUESDAY', '08:00:00', '16:00:00', TRUE, 30, NOW()),
('schedule-013', 'doctor-003', 'WEDNESDAY', '08:00:00', '16:00:00', TRUE, 30, NOW()),
('schedule-014', 'doctor-003', 'THURSDAY', '08:00:00', '16:00:00', TRUE, 30, NOW()),
('schedule-015', 'doctor-003', 'FRIDAY', '08:00:00', '16:00:00', TRUE, 30, NOW()),

-- Dr. James Brown (General Medicine) - Monday to Friday, 8 AM to 5 PM
('schedule-016', 'doctor-004', 'MONDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-017', 'doctor-004', 'TUESDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-018', 'doctor-004', 'WEDNESDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-019', 'doctor-004', 'THURSDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-020', 'doctor-004', 'FRIDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),

-- Dr. Maria Garcia (Dermatology) - Monday to Friday, 10 AM to 6 PM
('schedule-021', 'doctor-005', 'MONDAY', '10:00:00', '18:00:00', TRUE, 30, NOW()),
('schedule-022', 'doctor-005', 'TUESDAY', '10:00:00', '18:00:00', TRUE, 30, NOW()),
('schedule-023', 'doctor-005', 'WEDNESDAY', '10:00:00', '18:00:00', TRUE, 30, NOW()),
('schedule-024', 'doctor-005', 'THURSDAY', '10:00:00', '18:00:00', TRUE, 30, NOW()),
('schedule-025', 'doctor-005', 'FRIDAY', '10:00:00', '18:00:00', TRUE, 30, NOW())
ON DUPLICATE KEY UPDATE
    start_time = VALUES(start_time),
    end_time = VALUES(end_time),
    is_available = VALUES(is_available),
    slot_duration_minutes = VALUES(slot_duration_minutes),
    updated_at = NOW();

-- =====================================================
-- 7. GENERATE TIME SLOTS FOR NEXT 14 DAYS
-- =====================================================

SET @today = CURDATE();
SET @slot_id = 1;

-- Generate time slots for each doctor for the next 14 days
INSERT INTO time_slots (id, doctor_id, slot_date, start_time, end_time, is_available, is_booked, created_at)
SELECT 
    CONCAT('slot-', @slot_id := @slot_id + 1) as id,
    d.id as doctor_id,
    DATE_ADD(@today, INTERVAL day_offset DAY) as slot_date,
    TIME_FORMAT(SEC_TO_TIME(slot_minutes * 60), '%H:%i:%s') as start_time,
    TIME_FORMAT(SEC_TO_TIME((slot_minutes + ds.slot_duration_minutes) * 60), '%H:%i:%s') as end_time,
    TRUE as is_available,
    FALSE as is_booked,
    NOW() as created_at
FROM 
    doctors d
JOIN doctor_schedules ds ON d.id = ds.doctor_id
CROSS JOIN 
    (SELECT 0 as day_offset UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13) days
CROSS JOIN 
    (SELECT 0 as slot_minutes UNION SELECT 30 UNION SELECT 60 UNION SELECT 90 UNION SELECT 120 UNION SELECT 150 UNION SELECT 180 UNION SELECT 210 UNION SELECT 240 UNION SELECT 270 UNION SELECT 300 UNION SELECT 330 UNION SELECT 360 UNION SELECT 390 UNION SELECT 420 UNION SELECT 450 UNION SELECT 480 UNION SELECT 510 UNION SELECT 540) slots
WHERE 
    DAYOFWEEK(DATE_ADD(@today, INTERVAL day_offset DAY)) = 
    CASE ds.day_of_week
        WHEN 'MONDAY' THEN 2
        WHEN 'TUESDAY' THEN 3
        WHEN 'WEDNESDAY' THEN 4
        WHEN 'THURSDAY' THEN 5
        WHEN 'FRIDAY' THEN 6
        WHEN 'SATURDAY' THEN 7
        WHEN 'SUNDAY' THEN 1
    END
    AND TIME_FORMAT(SEC_TO_TIME(slot_minutes * 60), '%H:%i:%s') >= ds.start_time
    AND TIME_FORMAT(SEC_TO_TIME((slot_minutes + ds.slot_duration_minutes) * 60), '%H:%i:%s') <= ds.end_time
    AND ds.is_available = TRUE;

-- =====================================================
-- 8. INSERT SAMPLE APPOINTMENTS
-- =====================================================

-- Past appointments
INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, appointment_time, duration_minutes, status, consultation_fee, notes, created_at) VALUES
('appointment-001', 'patient-001', 'doctor-001', DATE_SUB(CURDATE(), INTERVAL 5 DAY), '10:00:00', 30, 'COMPLETED', 150.00, 'Regular checkup - blood pressure normal', NOW()),
('appointment-002', 'patient-002', 'doctor-004', DATE_SUB(CURDATE(), INTERVAL 3 DAY), '14:30:00', 30, 'COMPLETED', 100.00, 'General consultation - prescribed medication', NOW()),
('appointment-003', 'patient-003', 'doctor-002', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '09:00:00', 30, 'COMPLETED', 180.00, 'Neurological examination - follow-up needed', NOW()),

-- Today's appointments
('appointment-004', 'patient-001', 'doctor-001', CURDATE(), '10:00:00', 30, 'CONFIRMED', 150.00, 'Cardiology follow-up', NOW()),
('appointment-005', 'patient-004', 'doctor-003', CURDATE(), '14:00:00', 30, 'PENDING', 120.00, 'Pediatric consultation', NOW()),

-- Tomorrow's appointments
('appointment-006', 'patient-002', 'doctor-005', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:00:00', 30, 'CONFIRMED', 130.00, 'Skin examination', NOW()),
('appointment-007', 'patient-005', 'doctor-004', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '15:30:00', 30, 'PENDING', 100.00, 'General checkup', NOW()),

-- Upcoming appointments
('appointment-008', 'patient-003', 'doctor-002', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '09:30:00', 30, 'CONFIRMED', 180.00, 'Neurology follow-up', NOW()),
('appointment-009', 'patient-001', 'doctor-001', DATE_ADD(CURDATE(), INTERVAL 5 DAY), '16:00:00', 30, 'PENDING', 150.00, 'Cardiology review', NOW()),
('appointment-010', 'patient-004', 'doctor-003', DATE_ADD(CURDATE(), INTERVAL 7 DAY), '13:00:00', 30, 'CONFIRMED', 120.00, 'Pediatric follow-up', NOW())
ON DUPLICATE KEY UPDATE
    appointment_date = VALUES(appointment_date),
    appointment_time = VALUES(appointment_time),
    duration_minutes = VALUES(duration_minutes),
    status = VALUES(status),
    consultation_fee = VALUES(consultation_fee),
    notes = VALUES(notes),
    updated_at = NOW();

-- =====================================================
-- 9. MARK TIME SLOTS AS BOOKED
-- =====================================================

UPDATE time_slots ts
JOIN appointments a ON ts.doctor_id = a.doctor_id 
    AND ts.slot_date = a.appointment_date 
    AND ts.start_time = a.appointment_time
SET ts.is_booked = TRUE
WHERE a.id IN ('appointment-001', 'appointment-002', 'appointment-003', 'appointment-004', 'appointment-005', 'appointment-006', 'appointment-007', 'appointment-008', 'appointment-009', 'appointment-010');

-- =====================================================
-- 10. VERIFICATION AND SUMMARY
-- =====================================================

SELECT '=== DATABASE SETUP COMPLETE ===' as status;

SELECT 'Table Counts:' as info;
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Patients', COUNT(*) FROM patients
UNION ALL
SELECT 'Doctors', COUNT(*) FROM doctors
UNION ALL
SELECT 'Doctor Schedules', COUNT(*) FROM doctor_schedules
UNION ALL
SELECT 'Time Slots', COUNT(*) FROM time_slots
UNION ALL
SELECT 'Appointments', COUNT(*) FROM appointments
UNION ALL
SELECT 'Admins', COUNT(*) FROM admins;

SELECT 'Sample Doctors:' as info;
SELECT d.id, u.first_name, u.last_name, d.specialization, d.years_experience, d.consultation_fee 
FROM doctors d 
JOIN users u ON d.user_id = u.id 
LIMIT 5;

SELECT 'Sample Appointments:' as info;
SELECT a.id, u1.first_name as patient_name, u2.first_name as doctor_name, a.appointment_date, a.appointment_time, a.status
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN users u1 ON p.user_id = u1.id
JOIN doctors d ON a.doctor_id = d.id
JOIN users u2 ON d.user_id = u2.id
ORDER BY a.appointment_date, a.appointment_time
LIMIT 10;

SELECT 'Time Slots for Today:' as info;
SELECT ts.id, u.first_name, u.last_name, ts.slot_date, ts.start_time, ts.end_time, ts.is_available, ts.is_booked
FROM time_slots ts
JOIN doctors d ON ts.doctor_id = d.id
JOIN users u ON d.user_id = u.id
WHERE ts.slot_date = CURDATE()
ORDER BY ts.start_time
LIMIT 10;

-- =====================================================
-- 11. LOGIN CREDENTIALS
-- =====================================================

SELECT '=== LOGIN CREDENTIALS ===' as info;
SELECT 'Doctor Login:' as account_type, 'emily.davis@hospital.com' as email, 'password123' as password
UNION ALL
SELECT 'Patient Login:', 'john.smith@email.com', 'password123'
UNION ALL
SELECT 'Admin Login:', 'admin@mediconnect.com', 'Admin123!';

-- =====================================================
-- END OF SCRIPT
-- =====================================================
