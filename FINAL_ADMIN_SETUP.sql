-- =====================================================
-- MediConnect Admin Setup - FINAL VERSION
-- =====================================================
-- Admin Account: newadmin@mediconnect.com
-- Password: Admin123!
-- =====================================================

USE MediConnect;

-- =====================================================
-- Create Admin User
-- =====================================================
INSERT INTO users (id, first_name, last_name, email, password, phone, is_active, created_at, updated_at) VALUES
(UUID(), 'New', 'Admin', 'newadmin@mediconnect.com', '$2a$10$ES2oW5fgYllm0ouojBiPieZ3HTmXESrwamv5NoCCksBiDSxuEkyQ2', '+1234567002', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    first_name = VALUES(first_name),
    last_name = VALUES(last_name),
    password = VALUES(password),
    phone = VALUES(phone),
    is_active = VALUES(is_active),
    updated_at = NOW();

-- =====================================================
-- Create Admin Record
-- =====================================================
SET @admin_id = (SELECT id FROM users WHERE email = 'newadmin@mediconnect.com');

INSERT INTO admins (id, user_id, role_level, created_at) VALUES
(UUID(), @admin_id, 'ADMIN', NOW())
ON DUPLICATE KEY UPDATE
    role_level = VALUES(role_level);

-- =====================================================
-- Verification
-- =====================================================
SELECT '=== ADMIN SETUP COMPLETE ===' as status;

SELECT 'Admin User Details:' as info;
SELECT 
    u.id as user_id,
    u.first_name,
    u.last_name,
    u.email,
    u.is_active,
    a.role_level
FROM users u
JOIN admins a ON u.id = a.user_id
WHERE u.email = 'newadmin@mediconnect.com';

-- =====================================================
-- LOGIN INSTRUCTIONS
-- =====================================================
SELECT '=== LOGIN INSTRUCTIONS ===' as info;
SELECT '1. Go to the MediConnect website' as step1
UNION ALL
SELECT '2. Click the "Admin" button in the header' as step2
UNION ALL
SELECT '3. Enter Email: newadmin@mediconnect.com' as step3
UNION ALL
SELECT '4. Enter Password: Admin123!' as step4
UNION ALL
SELECT '5. Click Login' as step5;

-- =====================================================
-- END OF SCRIPT
-- =====================================================
