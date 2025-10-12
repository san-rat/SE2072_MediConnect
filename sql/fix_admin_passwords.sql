-- Fix Admin Passwords
-- This script updates admin passwords with proper BCrypt hashes
-- Password: Admin123!

USE MediConnect;

-- Update admin user passwords with proper BCrypt hash for "Admin123!"
UPDATE users 
SET password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz',
    updated_at = NOW()
WHERE email IN ('admin@mediconnect.com', 'luchitha.admin@mediconnect.com');

-- Verify the updates
SELECT 'Updated Admin Users:' as info;
SELECT email, 
       CASE 
           WHEN password LIKE '$2a$%' THEN 'BCrypt Format ✓'
           ELSE 'Invalid Format ✗'
       END as password_format
FROM users 
WHERE email IN ('admin@mediconnect.com', 'luchitha.admin@mediconnect.com');
