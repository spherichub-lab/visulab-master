-- Execute este script no SQL Editor do Supabase
-- Ele mostrará TODAS as colunas da tabela shortages

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'shortages'
ORDER BY ordinal_position;

-- Também vamos ver um exemplo de dados se houver
SELECT * FROM public.shortages LIMIT 1;
