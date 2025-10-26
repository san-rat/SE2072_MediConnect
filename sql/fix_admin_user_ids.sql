-- Fix Admin User IDs
-- This script updates the admins table to use the correct user IDs from the users table

USE MediConnect;

-- First, let's see what the actual user IDs are in the users table
SELECT 'Current User IDs:' as info;
SELECT id, email FROM users WHERE email IN ('admin@mediconnect.com', 'luchitha.admin@mediconnect.com');

-- Update the admins table to use the correct user IDs
UPDATE admins a
JOIN users u ON u.email = CASE 
    WHEN a.user_id = 'admin-001' THEN 'admin@mediconnect.com'
    WHEN a.user_id = 'admin-002' THEN 'luchitha.admin@mediconnect.com'
END
SET a.user_id = u.id;

-- Verify the fix
SELECT 'Updated Admin Records:' as info;
SELECT a.id, a.user_id, a.role_level, u.email
FROM admins a
JOIN users u ON a.user_id = u.id
WHERE u.email IN ('admin@mediconnect.com', 'luchitha.admin@mediconnect.com');
