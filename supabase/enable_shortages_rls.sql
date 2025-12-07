-- HABILITAR RLS NA TABELA SHORTAGES
-- Execute este script no SQL Editor do Supabase

-- 1. Habilitar RLS na tabela shortages
ALTER TABLE public.shortages ENABLE ROW LEVEL SECURITY;

-- 2. Criar políticas RLS para shortages
-- Admins podem fazer tudo
CREATE POLICY "Admins can do everything on shortages"
ON public.shortages
FOR ALL
USING (public.is_admin());

-- Usuários podem ver todas as faltas
CREATE POLICY "Users can view all shortages"
ON public.shortages
FOR SELECT
USING (true);

-- Usuários podem criar faltas
CREATE POLICY "Users can create shortages"
ON public.shortages
FOR INSERT
WITH CHECK (true);

-- Confirmação
SELECT 'RLS habilitado na tabela shortages!' as status;
