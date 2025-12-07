-- SCRIPT PARA APAGAR TODAS AS TABELAS DO PROJETO
-- Execute este script no Supabase SQL Editor

-- 1. Remover triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Remover funções
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.is_admin();

-- 3. Apagar tabelas (CASCADE remove todas as dependências)
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;

-- Confirmação
SELECT 'Todas as tabelas do projeto foram apagadas com sucesso!' as status;
