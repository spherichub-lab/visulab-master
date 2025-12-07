-- ATUALIZAR TRIGGER PARA SUPORTAR ROLE CUSTOMIZADA
-- Execute este script no SQL Editor do Supabase

-- 1. Remover trigger e função existentes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Recriar função com suporte a role customizada
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_company_id UUID;
  user_role TEXT;
BEGIN
  -- Get the default company ID (VisuLab HQ)
  SELECT id INTO default_company_id FROM public.companies WHERE name = 'VisuLab HQ' LIMIT 1;

  -- Get role from metadata, default to 'User' if not specified
  user_role := COALESCE(new.raw_user_meta_data->>'role', 
                        CASE WHEN new.email = 'admin@visulab.com' THEN 'Admin' ELSE 'User' END);

  INSERT INTO public.profiles (id, full_name, role, company_id, login, status)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Novo Usuário'),
    user_role,
    COALESCE((new.raw_user_meta_data->>'company_id')::UUID, default_company_id),
    COALESCE(new.raw_user_meta_data->>'login', new.email),
    'Active'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recriar trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Confirmação
SELECT 'Trigger atualizado com sucesso!' as status;
