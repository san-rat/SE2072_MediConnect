-- Simple Fix for Admin User IDs
-- This script fixes the admin user_id references step by step

USE MediConnect;

-- Step 1: Check current state
SELECT 'Current User IDs in users table:' as info;
SELECT id, email FROM users WHERE email IN ('admin@mediconnect.com', 'luchitha.admin@mediconnect.com');

SELECT 'Current Admin Records:' as info;
SELECT id, user_id, role_level FROM admins;

-- Step 2: Get the actual user IDs and store them in variables
SET @admin1_user_id = (SELECT id FROM users WHERE email = 'admin@mediconnect.com');
SET @admin2_user_id = (SELECT id FROM users WHERE email = 'luchitha.admin@mediconnect.com');

-- Step 3: Show what we found
SELECT 'Found User IDs:' as info;
SELECT @admin1_user_id as admin1_id, @admin2_user_id as admin2_id;

-- Step 4: Update admin records one by one
UPDATE admins SET user_id = @admin1_user_id WHERE user_id = 'admin-001';
UPDATE admins SET user_id = @admin2_user_id WHERE user_id = 'admin-002';

-- Step 5: Verify the fix
SELECT 'Updated Admin Records:' as info;
SELECT a.id, a.user_id, a.role_level, u.email
FROM admins a
JOIN users u ON a.user_id = u.id
WHERE u.email IN ('admin@mediconnect.com', 'luchitha.admin@mediconnect.com');
