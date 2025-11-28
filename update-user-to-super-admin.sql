-- Update existing users to SUPER_ADMIN role
-- This script updates all existing admin users to the new SUPER_ADMIN role

-- Update all users with ADMIN role to SUPER_ADMIN
UPDATE users 
SET role = 'SUPER_ADMIN' 
WHERE role = 'ADMIN';

-- Verify the update
SELECT id, email, role, "firstName", "lastName", "createdAt" 
FROM users 
ORDER BY "createdAt" DESC;
