-- Final Admin Fix
-- This script fixes the user_id references in the admins table

USE MediConnect;

-- Step 1: Show current state
SELECT 'Current Problem:' as info;
SELECT 'admins.user_id' as table_column, user_id as value FROM admins WHERE user_id IN ('admin-001', 'admin-002')
UNION ALL
SELECT 'users.id' as table_column, id as value FROM users WHERE email IN ('admin@mediconnect.com', 'luchitha.admin@mediconnect.com');

-- Step 2: Get the correct user IDs
SET @admin1_correct_id = (SELECT id FROM users WHERE email = 'admin@mediconnect.com');
SET @admin2_correct_id = (SELECT id FROM users WHERE email = 'luchitha.admin@mediconnect.com');

-- Step 3: Show what we found
SELECT 'Correct User IDs:' as info;
SELECT @admin1_correct_id as admin1_id, @admin2_correct_id as admin2_id;

-- Step 4: Fix the admins table
UPDATE admins SET user_id = @admin1_correct_id WHERE user_id = 'admin-001';
UPDATE admins SET user_id = @admin2_correct_id WHERE user_id = 'admin-002';

-- Step 5: Verify the fix
SELECT 'Fixed Admin Records:' as info;
SELECT a.id, a.user_id, a.role_level, u.email
FROM admins a
JOIN users u ON a.user_id = u.id
WHERE u.email IN ('admin@mediconnect.com', 'luchitha.admin@mediconnect.com');

-- Step 6: Test the AdminService query
SELECT 'AdminService Test (should work now):' as info;
SELECT a.id, a.user_id, a.role_level
FROM admins a
WHERE a.user_id IN (
    SELECT id FROM users 
    WHERE email IN ('admin@mediconnect.com', 'luchitha.admin@mediconnect.com')
);
