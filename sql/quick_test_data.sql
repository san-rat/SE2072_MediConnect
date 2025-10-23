-- Quick Test Data Setup for MediConnect
-- This script creates minimal test data to fix appointment issues

USE MediConnect;

-- Clear existing data (optional - uncomment if needed)
-- DELETE FROM appointments;
-- DELETE FROM time_slots;
-- DELETE FROM doctor_schedules;
-- DELETE FROM doctors WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%test%');
-- DELETE FROM patients WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%test%');
-- DELETE FROM users WHERE email LIKE '%test%';

-- Insert test users
INSERT INTO users (id, first_name, last_name, email, password, phone, is_active, created_at, updated_at) VALUES
('test-patient-001', 'John', 'Patient', 'john.patient@test.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567890', TRUE, NOW(), NOW()),
('test-doctor-001', 'Dr. Sarah', 'Doctor', 'sarah.doctor@test.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567891', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    first_name = VALUES(first_name),
    last_name = VALUES(last_name),
    password = VALUES(password),
    phone = VALUES(phone),
    is_active = VALUES(is_active),
    updated_at = NOW();

-- Insert test patient
INSERT INTO patients (id, user_id, date_of_birth, emergency_contact, blood_group, medical_history, created_at, updated_at) VALUES
('test-patient-001', 'test-patient-001', '1985-03-15', '+1234567890', 'A+', 'No significant medical history', NOW(), NOW())
ON DUPLICATE KEY UPDATE
    date_of_birth = VALUES(date_of_birth),
    emergency_contact = VALUES(emergency_contact),
    blood_group = VALUES(blood_group),
    medical_history = VALUES(medical_history),
    updated_at = NOW();

-- Insert test doctor
INSERT INTO doctors (id, user_id, specialization, license_number, years_experience, consultation_fee, created_at, updated_at) VALUES
('test-doctor-001', 'test-doctor-001', 'General Medicine', 'TEST-LIC-001', 10, 100.00, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    specialization = VALUES(specialization),
    license_number = VALUES(license_number),
    years_experience = VALUES(years_experience),
    consultation_fee = VALUES(consultation_fee),
    updated_at = NOW();

-- Insert doctor schedule (Monday to Friday, 9 AM to 5 PM)
INSERT INTO doctor_schedules (id, doctor_id, day_of_week, start_time, end_time, is_available, slot_duration_minutes, created_at, updated_at) VALUES
('test-schedule-001', 'test-doctor-001', 'MONDAY', '09:00:00', '17:00:00', TRUE, 30, NOW(), NOW()),
('test-schedule-002', 'test-doctor-001', 'TUESDAY', '09:00:00', '17:00:00', TRUE, 30, NOW(), NOW()),
('test-schedule-003', 'test-doctor-001', 'WEDNESDAY', '09:00:00', '17:00:00', TRUE, 30, NOW(), NOW()),
('test-schedule-004', 'test-doctor-001', 'THURSDAY', '09:00:00', '17:00:00', TRUE, 30, NOW(), NOW()),
('test-schedule-005', 'test-doctor-001', 'FRIDAY', '09:00:00', '17:00:00', TRUE, 30, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    start_time = VALUES(start_time),
    end_time = VALUES(end_time),
    is_available = VALUES(is_available),
    slot_duration_minutes = VALUES(slot_duration_minutes),
    updated_at = NOW();

-- Generate time slots for the next 7 days
-- This will create 30-minute slots from 9 AM to 5 PM for working days
SET @today = CURDATE();
SET @slot_counter = 1;

-- Generate time slots for the next 7 days
INSERT INTO time_slots (id, doctor_id, slot_date, start_time, end_time, is_available, is_booked, created_at, updated_at)
SELECT 
    CONCAT('test-slot-', @slot_counter := @slot_counter + 1) as id,
    'test-doctor-001' as doctor_id,
    DATE_ADD(@today, INTERVAL day_offset DAY) as slot_date,
    TIME_FORMAT(SEC_TO_TIME(slot_minutes * 60), '%H:%i:%s') as start_time,
    TIME_FORMAT(SEC_TO_TIME((slot_minutes + 30) * 60), '%H:%i:%s') as end_time,
    TRUE as is_available,
    FALSE as is_booked,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    (SELECT 0 as day_offset UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6) days
CROSS JOIN 
    (SELECT 0 as slot_minutes UNION SELECT 30 UNION SELECT 60 UNION SELECT 90 UNION SELECT 120 UNION SELECT 150 UNION SELECT 180 UNION SELECT 210 UNION SELECT 240 UNION SELECT 270 UNION SELECT 300 UNION SELECT 330 UNION SELECT 360 UNION SELECT 390 UNION SELECT 420 UNION SELECT 450 UNION SELECT 480) slots
WHERE 
    DAYOFWEEK(DATE_ADD(@today, INTERVAL day_offset DAY)) BETWEEN 2 AND 6  -- Monday to Friday only
    AND slot_minutes < 480; -- 8 hours = 480 minutes (9 AM to 5 PM)

-- Verify the data
SELECT '=== TEST DATA CREATED ===' as status;

SELECT 'Users' as table_name, COUNT(*) as count FROM users WHERE id LIKE 'test-%'
UNION ALL
SELECT 'Patients', COUNT(*) FROM patients WHERE id LIKE 'test-%'
UNION ALL
SELECT 'Doctors', COUNT(*) FROM doctors WHERE id LIKE 'test-%'
UNION ALL
SELECT 'Doctor Schedules', COUNT(*) FROM doctor_schedules WHERE id LIKE 'test-%'
UNION ALL
SELECT 'Time Slots', COUNT(*) FROM time_slots WHERE id LIKE 'test-%';

-- Show sample data
SELECT '=== TEST DOCTOR INFO ===' as info;
SELECT d.id, u.first_name, u.last_name, d.specialization, d.consultation_fee 
FROM doctors d 
JOIN users u ON d.user_id = u.id 
WHERE d.id = 'test-doctor-001';

SELECT '=== TEST TIME SLOTS FOR TODAY ===' as info;
SELECT ts.id, u.first_name, u.last_name, ts.slot_date, ts.start_time, ts.end_time, ts.is_available, ts.is_booked
FROM time_slots ts
JOIN doctors d ON ts.doctor_id = d.id
JOIN users u ON d.user_id = u.id
WHERE ts.slot_date = CURDATE() AND d.id = 'test-doctor-001'
LIMIT 5;

-- Test credentials
SELECT '=== TEST CREDENTIALS ===' as info;
SELECT 'Patient Login: john.patient@test.com / password123' as patient_login
UNION ALL
SELECT 'Doctor Login: sarah.doctor@test.com / password123' as doctor_login;
