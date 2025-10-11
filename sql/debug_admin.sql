-- Debug Admin Setup
-- Run this to check if admin records exist and are properly linked

USE MediConnect;

-- Check if admin users exist
SELECT 'Admin Users Check:' as info;
SELECT id, first_name, last_name, email, is_active 
FROM users 
WHERE email IN ('admin@mediconnect.com', 'luchitha.admin@mediconnect.com');

-- Check if admin records exist
SELECT 'Admin Records Check:' as info;
SELECT a.id, a.user_id, a.role_level, a.created_at, u.email
FROM admins a
JOIN users u ON a.user_id = u.id
WHERE u.email IN ('admin@mediconnect.com', 'luchitha.admin@mediconnect.com');

-- Check if admin service can find users
SELECT 'Admin Service Test:' as info;
SELECT a.id, a.user_id, a.role_level
FROM admins a
WHERE a.user_id IN (
    SELECT id FROM users 
    WHERE email IN ('admin@mediconnect.com', 'luchitha.admin@mediconnect.com')
);

-- Check password hash format
SELECT 'Password Check:' as info;
SELECT email, 
       CASE 
           WHEN password LIKE '$2a$%' THEN 'BCrypt Format ✓'
           ELSE 'Invalid Format ✗'
       END as password_format,
       LENGTH(password) as password_length
FROM users 
WHERE email IN ('admin@mediconnect.com', 'luchitha.admin@mediconnect.com');
