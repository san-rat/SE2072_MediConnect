-- Complete Admin Test
-- This script verifies everything is set up correctly for admin login

USE MediConnect;

-- 1. Check if admin users exist and are active
SELECT 'Admin Users Status:' as info;
SELECT id, first_name, last_name, email, is_active, 
       CASE 
           WHEN password LIKE '$2a$%' THEN 'BCrypt ✓'
           ELSE 'Invalid Format ✗'
       END as password_status
FROM users 
WHERE email IN ('admin@mediconnect.com', 'luchitha.admin@mediconnect.com');

-- 2. Check if admin records exist and are linked correctly
SELECT 'Admin Records Status:' as info;
SELECT a.id, a.user_id, a.role_level, u.email, u.is_active
FROM admins a
JOIN users u ON a.user_id = u.id
WHERE u.email IN ('admin@mediconnect.com', 'luchitha.admin@mediconnect.com');

-- 3. Test the exact query that AdminService.findByUserId() would use
SELECT 'AdminService Test:' as info;
SELECT a.id, a.user_id, a.role_level
FROM admins a
WHERE a.user_id IN (
    SELECT id FROM users 
    WHERE email IN ('admin@mediconnect.com', 'luchitha.admin@mediconnect.com')
);

-- 4. Check if there are any duplicate admin records
SELECT 'Duplicate Check:' as info;
SELECT user_id, COUNT(*) as count
FROM admins 
WHERE user_id IN (
    SELECT id FROM users 
    WHERE email IN ('admin@mediconnect.com', 'luchitha.admin@mediconnect.com')
)
GROUP BY user_id
HAVING COUNT(*) > 1;
