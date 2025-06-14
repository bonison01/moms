
-- First, let's make sure the admin user has a profile with admin role
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  '5b432923-73fa-4ffd-af78-bccf296eaca7',
  'admin@justmateng.com',
  'Admin User',
  'admin'
)
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  email = 'admin@justmateng.com',
  updated_at = NOW();
