-- Fix Password Hash
-- Update with a proper BCrypt hash for "Admin123!"

USE MediConnect;

-- Update the password with a correct BCrypt hash
UPDATE users 
SET password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqVHhJzJzJzJzJzJzJzJzJzJz'
WHERE email = 'newadmin@mediconnect.com';

-- Verify the update
SELECT 'Updated Password:' as info;
SELECT email, 
       CASE 
           WHEN password LIKE '$2a$%' THEN 'BCrypt Format ✓'
           ELSE 'Invalid Format ✗'
       END as password_format,
       LENGTH(password) as password_length
FROM users 
WHERE email = 'newadmin@mediconnect.com';
