-- =====================================================
-- MediConnect Admin Setup Script - SIMPLE VERSION
-- =====================================================
-- This script creates ONE admin user: newadmin@mediconnect.com
-- Run this script in MySQL Workbench or any MySQL client
-- =====================================================

USE MediConnect;

-- =====================================================
-- Create Admin User
-- =====================================================
-- Insert admin user with proper BCrypt password hash
-- Password: Admin123!

INSERT INTO users (id, first_name, last_name, email, password, phone, is_active, created_at, updated_at) VALUES
(UUID(), 'New', 'Admin', 'newadmin@mediconnect.com', '$2a$10$5AT1/o6SBAd8REO.1I747.jlM8Z0lr9bjQlHwtVXIU3JqgaJEtxiW', '+1234567002', TRUE, NOW(), NOW())
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
-- Get the user ID for the admin user
SET @admin_id = (SELECT id FROM users WHERE email = 'newadmin@mediconnect.com');

-- Create admin record in the admins table
INSERT INTO admins (id, user_id, role_level, created_at) VALUES
(UUID(), @admin_id, 'ADMIN', NOW())
ON DUPLICATE KEY UPDATE
    role_level = VALUES(role_level);

-- =====================================================
-- Verification
-- =====================================================
SELECT '=== ADMIN SETUP COMPLETE ===' as status;

SELECT 'Admin User Created:' as info;
SELECT 
    u.id as user_id,
    u.first_name,
    u.last_name,
    u.email,
    u.is_active,
    a.role_level,
    a.id as admin_id
FROM users u
JOIN admins a ON u.id = a.user_id
WHERE u.email = 'newadmin@mediconnect.com';

-- =====================================================
-- LOGIN CREDENTIALS
-- =====================================================
SELECT '=== LOGIN CREDENTIALS ===' as info;
SELECT 'Email: newadmin@mediconnect.com' as email, 'Password: Admin123!' as password;

-- =====================================================
-- NOTES
-- =====================================================
SELECT '=== IMPORTANT NOTES ===' as info;
SELECT '1. Use the Admin button on the website to login' as note1
UNION ALL
SELECT '2. Admin dashboard will be available after login' as note2
UNION ALL
SELECT '3. This account has ADMIN role level' as note3;

-- =====================================================
-- END OF SCRIPT
-- =====================================================
