-- Script to seed the database with an Admin profile and Company
-- Run this AFTER creating the user 'admin@visulab.com' in Supabase Auth (e.g. via the Login page button)

-- 1. Insert a default Company
INSERT INTO companies (id, name, type, status, contact_name, contact_email)
VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'VisuLab HQ', 
  'Matriz', 
  'Active',
  'Admin System',
  'admin@visulab.com'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert or Update the Admin Profile linked to the auth user
INSERT INTO profiles (id, full_name, role, company_id, login, status)
SELECT 
  id, 
  'Administrador Sistema', 
  'Admin', 
  '00000000-0000-0000-0000-000000000001', 
  'admin@visulab', 
  'Active'
FROM auth.users 
WHERE email = 'admin@visulab.com'
ON CONFLICT (id) DO UPDATE 
SET 
  role = 'Admin', 
  company_id = '00000000-0000-0000-0000-000000000001',
  full_name = 'Administrador Sistema',
  status = 'Active';

-- 3. Ensure RLS policies allow the admin to work (re-run just in case)
-- (Policies are defined in rls_policies.sql, this is just data seeding)
