USE MediConnect;

-- ------------------------------------
-- 1) CREATE MISSING TABLES (once)
-- ------------------------------------
CREATE TABLE IF NOT EXISTS doctor_schedules (
    id CHAR(36) NOT NULL PRIMARY KEY,
    doctor_id CHAR(36) NOT NULL,
    day_of_week ENUM('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available TINYINT(1) NOT NULL DEFAULT 1,
    slot_duration_minutes INT NOT NULL DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sched_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    INDEX idx_sched_doctor_dow (doctor_id, day_of_week)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS time_slots (
    id CHAR(36) NOT NULL PRIMARY KEY,
    doctor_id CHAR(36) NOT NULL,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available TINYINT(1) NOT NULL DEFAULT 1,
    is_booked TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_slot_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    UNIQUE KEY uq_slot_unique (doctor_id, slot_date, start_time)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS appointments (
    id CHAR(36) NOT NULL PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    doctor_id CHAR(36) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    status ENUM('PENDING','CONFIRMED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
    consultation_fee DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appt_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_appt_doctor  FOREIGN KEY (doctor_id)  REFERENCES doctors(id)  ON DELETE CASCADE,
    INDEX idx_appt_doctor_date (doctor_id, appointment_date),
    INDEX idx_appt_patient_date (patient_id, appointment_date)
) ENGINE=InnoDB;

-- ------------------------------------
-- 2) WEEKLY SCHEDULES (Mon–Fri 08–17)
--    Idempotent: only inserts missing rows
-- ------------------------------------
INSERT INTO doctor_schedules (id, doctor_id, day_of_week, start_time, end_time, is_available, slot_duration_minutes, created_at)
SELECT UUID(), d.id, days.dow, '08:00:00', '17:00:00', 1, 30, NOW()
FROM doctors d
JOIN (
  SELECT 'MONDAY' AS dow UNION SELECT 'TUESDAY' UNION SELECT 'WEDNESDAY'
  UNION SELECT 'THURSDAY' UNION SELECT 'FRIDAY'
) AS days
LEFT JOIN doctor_schedules s
  ON s.doctor_id = d.id AND s.day_of_week = days.dow
WHERE s.id IS NULL;

-- ------------------------------------
-- 3) NEXT 7 DAYS OF 30-MIN SLOTS
--    Mon–Fri only. Idempotent (NOT EXISTS)
-- ------------------------------------
SET @today := CURDATE();

-- minutes list for 08:00..16:30 starts (end 17:00)
-- (avoid CTEs for MySQL 5.7 compatibility)
INSERT INTO time_slots (id, doctor_id, slot_date, start_time, end_time, is_available, is_booked, created_at)
SELECT
  UUID(),
  d.id,
  DATE_ADD(@today, INTERVAL dd.day_offset DAY) AS slot_date,
  SEC_TO_TIME((mm.start_minute) * 60)          AS start_time,
  SEC_TO_TIME((mm.start_minute + 30) * 60)     AS end_time,
  1, 0, NOW()
FROM doctors d
CROSS JOIN (
  SELECT 0 AS day_offset UNION SELECT 1 UNION SELECT 2 UNION
  SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6
) AS dd
CROSS JOIN (
  SELECT 480 AS start_minute UNION SELECT 510 UNION SELECT 540 UNION SELECT 570 UNION
  SELECT 600 UNION SELECT 630 UNION SELECT 660 UNION SELECT 690 UNION
  SELECT 720 UNION SELECT 750 UNION SELECT 780 UNION SELECT 810 UNION
  SELECT 840 UNION SELECT 870 UNION SELECT 900 UNION SELECT 930 UNION
  SELECT 960
) AS mm
LEFT JOIN time_slots t
  ON t.doctor_id  = d.id
 AND t.slot_date  = DATE_ADD(@today, INTERVAL dd.day_offset DAY)
 AND t.start_time = SEC_TO_TIME((mm.start_minute) * 60)
WHERE DAYOFWEEK(DATE_ADD(@today, INTERVAL dd.day_offset DAY)) BETWEEN 2 AND 6
  AND t.id IS NULL;

-- ------------------------------------
-- 4) SAMPLE APPOINTMENTS (idempotent)
--    Looks up patients/doctors by email
-- ------------------------------------
-- Patient IDs via their user emails (your friend’s dataset)
SELECT p.id INTO @p1
FROM patients p JOIN users u ON u.id = p.user_id
WHERE u.email = 'john.smith@email.com' LIMIT 1;

SELECT p.id INTO @p2
FROM patients p JOIN users u ON u.id = p.user_id
WHERE u.email = 'sarah.johnson@email.com' LIMIT 1;

SELECT p.id INTO @p3
FROM patients p JOIN users u ON u.id = p.user_id
WHERE u.email = 'michael.chen@email.com' LIMIT 1;

-- Doctor IDs via their user emails
SELECT d.id INTO @d1 FROM doctors d JOIN users u ON u.id=d.user_id WHERE u.email='emily.davis@hospital.com'   LIMIT 1;
SELECT d.id INTO @d2 FROM doctors d JOIN users u ON u.id=d.user_id WHERE u.email='robert.wilson@hospital.com'  LIMIT 1;
SELECT d.id INTO @d3 FROM doctors d JOIN users u ON u.id=d.user_id WHERE u.email='lisa.anderson@hospital.com'  LIMIT 1;
SELECT d.id INTO @d4 FROM doctors d JOIN users u ON u.id=d.user_id WHERE u.email='james.brown@hospital.com'    LIMIT 1;
SELECT d.id INTO @d5 FROM doctors d JOIN users u ON u.id=d.user_id WHERE u.email='maria.garcia@hospital.com'    LIMIT 1;
SELECT d.id INTO @d6 FROM doctors d JOIN users u ON u.id=d.user_id WHERE u.email='david.martinez@hospital.com'  LIMIT 1;
SELECT d.id INTO @d7 FROM doctors d JOIN users u ON u.id=d.user_id WHERE u.email='jennifer.taylor@hospital.com' LIMIT 1;

-- Insert only if both sides exist and same appt not already present
-- Make sure these session vars exist (run earlier lookups before this block)
-- @p1, @p2, @p3, @d1..@d7

INSERT INTO appointments
  (id, patient_id, doctor_id, appointment_date, appointment_time, duration_minutes, status, consultation_fee, notes, created_at)
SELECT
  UUID(), @p1, @d1, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '10:00:00', 30, 'COMPLETED', 150.00, 'Regular checkup', NOW()
WHERE @p1 IS NOT NULL AND @d1 IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM appointments
    WHERE patient_id=@p1 AND doctor_id=@d1
      AND appointment_date=DATE_SUB(CURDATE(), INTERVAL 5 DAY)
      AND appointment_time='10:00:00'
  );

INSERT INTO appointments
  (id, patient_id, doctor_id, appointment_date, appointment_time, duration_minutes, status, consultation_fee, notes, created_at)
SELECT
  UUID(), @p2, @d4, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '14:30:00', 30, 'COMPLETED', 100.00, 'General consultation', NOW()
WHERE @p2 IS NOT NULL AND @d4 IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM appointments
    WHERE patient_id=@p2 AND doctor_id=@d4
      AND appointment_date=DATE_SUB(CURDATE(), INTERVAL 3 DAY)
      AND appointment_time='14:30:00'
  );

INSERT INTO appointments
  (id, patient_id, doctor_id, appointment_date, appointment_time, duration_minutes, status, consultation_fee, notes, created_at)
SELECT
  UUID(), @p3, @d2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '09:00:00', 30, 'COMPLETED', 180.00, 'Neurological examination', NOW()
WHERE @p3 IS NOT NULL AND @d2 IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM appointments
    WHERE patient_id=@p3 AND doctor_id=@d2
      AND appointment_date=DATE_SUB(CURDATE(), INTERVAL 1 DAY)
      AND appointment_time='09:00:00'
  );

INSERT INTO appointments
  (id, patient_id, doctor_id, appointment_date, appointment_time, duration_minutes, status, consultation_fee, notes, created_at)
SELECT
  UUID(), @p1, @d7, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:00:00', 30, 'CONFIRMED', 160.00, 'Cardiology follow-up', NOW()
WHERE @p1 IS NOT NULL AND @d7 IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM appointments
    WHERE patient_id=@p1 AND doctor_id=@d7
      AND appointment_date=DATE_ADD(CURDATE(), INTERVAL 1 DAY)
      AND appointment_time='11:00:00'
  );

INSERT INTO appointments
  (id, patient_id, doctor_id, appointment_date, appointment_time, duration_minutes, status, consultation_fee, notes, created_at)
SELECT
  UUID(), @p2, @d5, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '15:30:00', 30, 'PENDING', 130.00, 'Skin examination', NOW()
WHERE @p2 IS NOT NULL AND @d5 IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM appointments
    WHERE patient_id=@p2 AND doctor_id=@d5
      AND appointment_date=DATE_ADD(CURDATE(), INTERVAL 2 DAY)
      AND appointment_time='15:30:00'
  );
-- ------------------------------------
-- 5) FLAG THE MATCHED SLOTS AS BOOKED
-- ------------------------------------
UPDATE time_slots ts
JOIN appointments a
  ON ts.doctor_id  = a.doctor_id
 AND ts.slot_date  = a.appointment_date
 AND ts.start_time = a.appointment_time
SET ts.is_booked = 1;
-- ------------------------------------
-- 6) QUICK CHECKS
-- ------------------------------------
SELECT 'Users' AS tbl, COUNT(*) AS cnt FROM users
UNION ALL SELECT 'Patients', COUNT(*) FROM patients
UNION ALL SELECT 'Doctors', COUNT(*) FROM doctors
UNION ALL SELECT 'Doctor Schedules', COUNT(*) FROM doctor_schedules
UNION ALL SELECT 'Time Slots', COUNT(*) FROM time_slots
UNION ALL SELECT 'Appointments', COUNT(*) FROM appointments;

SELECT d.id AS doctor_id, u.first_name, u.last_name, d.specialization
FROM doctors d JOIN users u ON u.id = d.user_id LIMIT 7;

SELECT ts.doctor_id, ts.slot_date, ts.start_time, ts.end_time, ts.is_booked
FROM time_slots ts
ORDER BY ts.slot_date, ts.start_time
LIMIT 15;