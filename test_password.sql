-- Test Password Hash
-- Let's try a different BCrypt hash format

USE MediConnect;

-- Try updating with a standard BCrypt hash (without {bcrypt} prefix)
UPDATE users
SET password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz'
WHERE email = 'luchitha.admin@mediconnect.com';

-- Also update the other admin
UPDATE users
SET password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz'
WHERE email = 'admin@mediconnect.com';

-- Verify the updates
SELECT 'Updated Passwords:' as info;
SELECT email, 
       CASE 
           WHEN password LIKE '$2a$%' THEN 'BCrypt Format ✓'
           ELSE 'Invalid Format ✗'
       END as password_format,
       LENGTH(password) as password_length
FROM users 
WHERE email IN ('admin@mediconnect.com', 'luchitha.admin@mediconnect.com');
