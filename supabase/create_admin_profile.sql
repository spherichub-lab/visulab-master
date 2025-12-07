-- SCRIPT PARA CRIAR ADMIN MANUALMENTE
-- Execute este script DEPOIS de criar o usuário admin@visulab.com no Supabase Auth

-- Primeiro, vamos verificar se o usuário existe no auth
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'admin@visulab.com';

-- Se o usuário existir, este INSERT vai criar o perfil
-- Se não existir, você precisa criar o usuário primeiro via Dashboard ou pelo botão na app

INSERT INTO public.profiles (id, full_name, role, company_id, login, status)
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

-- Verificar se o perfil foi criado
SELECT * FROM public.profiles WHERE login = 'admin@visulab';
