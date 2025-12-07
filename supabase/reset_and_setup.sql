-- COMPLETE RESET SCRIPT
-- WARNING: This will delete all data in 'profiles' and 'companies' tables.

-- 1. Drop existing tables
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- 2. Create Tables

-- Companies Table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Matriz' or 'Filial'
    status TEXT DEFAULT 'Active',
    contact_name TEXT,
    contact_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles Table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    company_id UUID REFERENCES companies(id),
    role TEXT CHECK (role IN ('Admin', 'Administrator', 'User', 'Viewer')),
    login TEXT,
    status TEXT DEFAULT 'Active',
    last_active TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Profiles: Admins can do everything
CREATE POLICY "Admins can do everything on profiles"
ON profiles
FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('Admin', 'Administrator')
  )
);

-- Profiles: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);

-- Profiles: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id);

-- Companies: Admins can do everything
CREATE POLICY "Admins can do everything on companies"
ON companies
FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('Admin', 'Administrator')
  )
);

-- Companies: Users can view companies (for dropdowns, etc.)
CREATE POLICY "Users can view companies"
ON companies
FOR SELECT
USING (true);


-- 5. Seed Initial Data

-- Create Default Company (Matriz)
INSERT INTO companies (id, name, type, status, contact_name, contact_email)
VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'VisuLab HQ', 
  'Matriz', 
  'Active',
  'Admin System',
  'admin@visulab.com'
);

-- Create Admin Profile (Linked to auth user 'admin@visulab.com' if it exists)
-- NOTE: This requires the user 'admin@visulab.com' to exist in Authentication > Users
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
  status = 'Active';
