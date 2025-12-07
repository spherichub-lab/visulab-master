-- CORREÇÃO DE PERMISSÕES (RLS)
-- Execute este script para permitir que o Dashboard mostre os nomes dos usuários

-- 1. Atualizar RLS de Profiles para permitir que todos vejam os nomes uns dos outros
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- 2. Garantir RLS de Shortages (caso não tenha sido rodado antes)
ALTER TABLE public.shortages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all shortages" ON public.shortages;
CREATE POLICY "Users can view all shortages" 
ON public.shortages 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can create shortages" ON public.shortages;
CREATE POLICY "Users can create shortages" 
ON public.shortages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Adicionar Foreign Key se não existir (para garantir o join)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'shortages_user_id_fkey'
    ) THEN
        ALTER TABLE public.shortages 
        ADD CONSTRAINT shortages_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES public.profiles(id);
    END IF;
END $$;
