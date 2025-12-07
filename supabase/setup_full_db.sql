-- FULL DATABASE SETUP SCRIPT
-- Run this in Supabase SQL Editor

-- 1. Cleanup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.is_admin();
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;

-- 2. Create Tables
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    contact_name TEXT,
    contact_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    company_id UUID REFERENCES public.companies(id),
    role TEXT CHECK (role IN ('Admin', 'Administrator', 'User', 'Viewer')),
    login TEXT,
    status TEXT DEFAULT 'Active',
    last_active TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insert Default Company
INSERT INTO public.companies (id, name, type, status, contact_name, contact_email)
VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'VisuLab HQ', 
  'Matriz', 
  'Active',
  'Admin System',
  'admin@visulab.com'
);

-- 4. Helper Function to Check Admin Role (Avoids RLS Recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND (role = 'Admin' OR role = 'Administrator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can do everything on profiles" ON public.profiles
FOR ALL USING (public.is_admin());

-- Companies
CREATE POLICY "Users can view companies" ON public.companies
FOR SELECT USING (true);

CREATE POLICY "Admins can do everything on companies" ON public.companies
FOR ALL USING (public.is_admin());

-- 7. Trigger to Auto-Create Profile for New Users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_company_id UUID;
BEGIN
  -- Get the default company ID (VisuLab HQ)
  SELECT id INTO default_company_id FROM public.companies WHERE name = 'VisuLab HQ' LIMIT 1;

  INSERT INTO public.profiles (id, full_name, role, company_id, login, status)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Novo Usuário'),
    -- If email is admin@visulab.com, make them Admin, otherwise User
    CASE WHEN new.email = 'admin@visulab.com' THEN 'Admin' ELSE 'User' END,
    default_company_id,
    new.email, -- Use email as initial login
    'Active'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Sync existing users (if any exist and missed the trigger)
INSERT INTO public.profiles (id, full_name, role, company_id, login, status)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'full_name', 'Usuário Existente'),
  CASE WHEN email = 'admin@visulab.com' THEN 'Admin' ELSE 'User' END,
  '00000000-0000-0000-0000-000000000001', 
  email, 
  'Active'
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET role = EXCLUDED.role; -- Ensure admin gets admin role if re-running
