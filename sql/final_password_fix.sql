-- Final Password Fix for Admin Login
-- This script updates the password with the correct BCrypt hash

USE MediConnect;

-- Update the password for 'newadmin@mediconnect.com' with the correct BCrypt hash
UPDATE users
SET password = '$2a$10$5AT1/o6SBAd8REO.1I747.jlM8Z0lr9bjQlHwtVXIU3JqgaJEtxiW'
WHERE email = 'newadmin@mediconnect.com';

SELECT 'Password updated for newadmin@mediconnect.com' AS Status;

-- Verify the password hash
SELECT id, email, password FROM users WHERE email = 'newadmin@mediconnect.com';

-- Test the login
SELECT 'Now try logging in with:' AS Test_Info;
SELECT 'Email: newadmin@mediconnect.com' AS Email;
SELECT 'Password: Admin123!' AS Password;
