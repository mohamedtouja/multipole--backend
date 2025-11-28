-- Delete any existing admin user
DELETE FROM users WHERE email = 'admin@multipoles.com';

-- Insert fresh admin user with correct password hash
INSERT INTO users (id, email, password, role, "firstName", "lastName", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@multipoles.com',
  '$2b$12$G261AJPpy.p3XZSuhgk3je7IEa8PIsBCjuKxs7I6D71f.eKaKaRo6',
  'ADMIN',
  'Admin',
  'User',
  NOW(),
  NOW()
);

-- Verify the user was created
SELECT email, role, "firstName", "lastName" FROM users WHERE email = 'admin@multipoles.com';
