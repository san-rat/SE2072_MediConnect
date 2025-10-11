-- Admin Setup Script for MediConnect
-- This script creates admin role records for existing users
-- Run this script in MySQL Workbench to set up admin accounts

USE MediConnect;

-- Get the user IDs for existing admin users
SET @admin1_id = (SELECT id FROM users WHERE email = 'admin@mediconnect.com');
SET @admin2_id = (SELECT id FROM users WHERE email = 'luchitha.admin@mediconnect.com');

-- Create admin records in the admins table (or update if they exist)
INSERT INTO admins (id, user_id, role_level, created_at) VALUES
(UUID(), @admin1_id, 'SUPER_ADMIN', NOW()),
(UUID(), @admin2_id, 'ADMIN', NOW())
ON DUPLICATE KEY UPDATE
    role_level = VALUES(role_level);

-- Verify the admin users were created
SELECT 'Admin Users Created:' as info;
SELECT u.id, u.first_name, u.last_name, u.email, u.is_active, a.role_level
FROM users u
JOIN admins a ON u.id = a.user_id
WHERE u.email IN ('admin@mediconnect.com', 'luchitha.admin@mediconnect.com');

-- Show total counts
SELECT 'Total Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Total Admins', COUNT(*) FROM admins;
