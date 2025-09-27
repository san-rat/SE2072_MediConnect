-- MediConnect Test Data Script
-- Run this script in MySQL Workbench to populate the database with test data

-- First, let's check if we have any existing data and clear it (optional)
-- DELETE FROM appointments;
-- DELETE FROM time_slots;
-- DELETE FROM doctor_schedules;
-- DELETE FROM doctors;
-- DELETE FROM patients;
-- DELETE FROM users;

-- Insert test users
INSERT INTO users (id, first_name, last_name, email, password, phone, is_active, created_at) VALUES
('user-001', 'John', 'Smith', 'john.smith@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567890', TRUE, NOW()),
('user-002', 'Sarah', 'Johnson', 'sarah.johnson@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567891', TRUE, NOW()),
('user-003', 'Michael', 'Chen', 'michael.chen@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567892', TRUE, NOW()),
('user-004', 'Dr. Emily', 'Davis', 'emily.davis@hospital.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567893', TRUE, NOW()),
('user-005', 'Dr. Robert', 'Wilson', 'robert.wilson@hospital.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567894', TRUE, NOW()),
('user-006', 'Dr. Lisa', 'Anderson', 'lisa.anderson@hospital.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567895', TRUE, NOW()),
('user-007', 'Dr. James', 'Brown', 'james.brown@hospital.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567896', TRUE, NOW()),
('user-008', 'Dr. Maria', 'Garcia', 'maria.garcia@hospital.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567897', TRUE, NOW()),
('user-009', 'Dr. David', 'Martinez', 'david.martinez@hospital.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567898', TRUE, NOW()),
('user-010', 'Dr. Jennifer', 'Taylor', 'jennifer.taylor@hospital.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz', '+1234567899', TRUE, NOW());

-- Insert test patients
INSERT INTO patients (id, user_id, date_of_birth, emergency_contact, blood_group, medical_history, created_at) VALUES
('patient-001', 'user-001', '1985-03-15', '+1234567890', 'A+', 'No significant medical history', NOW()),
('patient-002', 'user-002', '1990-07-22', '+1234567891', 'B+', 'Allergic to penicillin', NOW()),
('patient-003', 'user-003', '1988-11-08', '+1234567892', 'O+', 'Diabetes type 2', NOW());

-- Insert test doctors
INSERT INTO doctors (id, user_id, specialization, license_number, years_experience, consultation_fee, created_at) VALUES
('doctor-001', 'user-004', 'Cardiology', 'LIC-CARD-001', 12, 150.00, NOW()),
('doctor-002', 'user-005', 'Neurology', 'LIC-NEUR-002', 8, 180.00, NOW()),
('doctor-003', 'user-006', 'Pediatrics', 'LIC-PED-003', 15, 120.00, NOW()),
('doctor-004', 'user-007', 'General Medicine', 'LIC-GEN-004', 10, 100.00, NOW()),
('doctor-005', 'user-008', 'Dermatology', 'LIC-DERM-005', 6, 130.00, NOW()),
('doctor-006', 'user-009', 'Orthopedics', 'LIC-ORTH-006', 20, 200.00, NOW()),
('doctor-007', 'user-010', 'Cardiology', 'LIC-CARD-007', 14, 160.00, NOW());

-- Insert doctor schedules (Monday to Friday, 8 AM to 5 PM for all doctors)
INSERT INTO doctor_schedules (id, doctor_id, day_of_week, start_time, end_time, is_available, slot_duration_minutes, created_at) VALUES
-- Dr. Emily Davis (Cardiology)
('schedule-001', 'doctor-001', 'MONDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-002', 'doctor-001', 'TUESDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-003', 'doctor-001', 'WEDNESDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-004', 'doctor-001', 'THURSDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-005', 'doctor-001', 'FRIDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),

-- Dr. Robert Wilson (Neurology)
('schedule-006', 'doctor-002', 'MONDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-007', 'doctor-002', 'TUESDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-008', 'doctor-002', 'WEDNESDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-009', 'doctor-002', 'THURSDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-010', 'doctor-002', 'FRIDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),

-- Dr. Lisa Anderson (Pediatrics)
('schedule-011', 'doctor-003', 'MONDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-012', 'doctor-003', 'TUESDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-013', 'doctor-003', 'WEDNESDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-014', 'doctor-003', 'THURSDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-015', 'doctor-003', 'FRIDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),

-- Dr. James Brown (General Medicine)
('schedule-016', 'doctor-004', 'MONDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-017', 'doctor-004', 'TUESDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-018', 'doctor-004', 'WEDNESDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-019', 'doctor-004', 'THURSDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-020', 'doctor-004', 'FRIDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),

-- Dr. Maria Garcia (Dermatology)
('schedule-021', 'doctor-005', 'MONDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-022', 'doctor-005', 'TUESDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-023', 'doctor-005', 'WEDNESDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-024', 'doctor-005', 'THURSDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-025', 'doctor-005', 'FRIDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),

-- Dr. David Martinez (Orthopedics)
('schedule-026', 'doctor-006', 'MONDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-027', 'doctor-006', 'TUESDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-028', 'doctor-006', 'WEDNESDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-029', 'doctor-006', 'THURSDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-030', 'doctor-006', 'FRIDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),

-- Dr. Jennifer Taylor (Cardiology)
('schedule-031', 'doctor-007', 'MONDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-032', 'doctor-007', 'TUESDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-033', 'doctor-007', 'WEDNESDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-034', 'doctor-007', 'THURSDAY', '08:00:00', '17:00:00', TRUE, 30, NOW()),
('schedule-035', 'doctor-007', 'FRIDAY', '08:00:00', '17:00:00', TRUE, 30, NOW());

-- Generate time slots for the next 7 days for all doctors
-- This creates 30-minute slots from 8 AM to 5 PM for each working day

-- Time slots for today (adjust the date as needed)
SET @today = CURDATE();
SET @slot_id = 1;

-- Generate time slots for each doctor for the next 7 days
INSERT INTO time_slots (id, doctor_id, slot_date, start_time, end_time, is_available, is_booked, created_at)
SELECT 
    CONCAT('slot-', @slot_id := @slot_id + 1) as id,
    d.id as doctor_id,
    DATE_ADD(@today, INTERVAL day_offset DAY) as slot_date,
    TIME_FORMAT(SEC_TO_TIME(slot_minutes * 60), '%H:%i:%s') as start_time,
    TIME_FORMAT(SEC_TO_TIME((slot_minutes + 30) * 60), '%H:%i:%s') as end_time,
    TRUE as is_available,
    FALSE as is_booked,
    NOW() as created_at
FROM 
    doctors d
CROSS JOIN 
    (SELECT 0 as day_offset UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6) days
CROSS JOIN 
    (SELECT 0 as slot_minutes UNION SELECT 30 UNION SELECT 60 UNION SELECT 90 UNION SELECT 120 UNION SELECT 150 UNION SELECT 180 UNION SELECT 210 UNION SELECT 240 UNION SELECT 270 UNION SELECT 300 UNION SELECT 330 UNION SELECT 360 UNION SELECT 390 UNION SELECT 420 UNION SELECT 450 UNION SELECT 480 UNION SELECT 510) slots
WHERE 
    DAYOFWEEK(DATE_ADD(@today, INTERVAL day_offset DAY)) BETWEEN 2 AND 6  -- Monday to Friday only
    AND slot_minutes < 540; -- 9 hours = 540 minutes (8 AM to 5 PM)

-- Insert some sample appointments (optional - for testing history)
INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, appointment_time, duration_minutes, status, consultation_fee, notes, created_at) VALUES
('appointment-001', 'patient-001', 'doctor-001', DATE_SUB(CURDATE(), INTERVAL 5 DAY), '10:00:00', 30, 'COMPLETED', 150.00, 'Regular checkup', NOW()),
('appointment-002', 'patient-002', 'doctor-004', DATE_SUB(CURDATE(), INTERVAL 3 DAY), '14:30:00', 30, 'COMPLETED', 100.00, 'General consultation', NOW()),
('appointment-003', 'patient-003', 'doctor-002', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '09:00:00', 30, 'COMPLETED', 180.00, 'Neurological examination', NOW()),
('appointment-004', 'patient-001', 'doctor-007', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:00:00', 30, 'CONFIRMED', 160.00, 'Cardiology follow-up', NOW()),
('appointment-005', 'patient-002', 'doctor-005', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '15:30:00', 30, 'PENDING', 130.00, 'Skin examination', NOW());

-- Mark some time slots as booked (for the appointments above)
UPDATE time_slots ts
JOIN appointments a ON ts.doctor_id = a.doctor_id 
    AND ts.slot_date = a.appointment_date 
    AND ts.start_time = a.appointment_time
SET ts.is_booked = TRUE
WHERE a.id IN ('appointment-001', 'appointment-002', 'appointment-003', 'appointment-004', 'appointment-005');

-- Verify the data
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
SELECT 'Appointments', COUNT(*) FROM appointments;

-- Show sample data
SELECT 'Sample Doctors:' as info;
SELECT d.id, u.first_name, u.last_name, d.specialization, d.years_experience, d.consultation_fee 
FROM doctors d 
JOIN users u ON d.user_id = u.id 
LIMIT 5;

SELECT 'Sample Time Slots for Today:' as info;
SELECT ts.id, u.first_name, u.last_name, ts.slot_date, ts.start_time, ts.end_time, ts.is_available, ts.is_booked
FROM time_slots ts
JOIN doctors d ON ts.doctor_id = d.id
JOIN users u ON d.user_id = u.id
WHERE ts.slot_date = CURDATE()
LIMIT 10;
