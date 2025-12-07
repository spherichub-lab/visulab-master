-- VERIFICAR ESTRUTURA DA TABELA SHORTAGES
-- Execute este script no SQL Editor do Supabase para ver as colunas

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'shortages' 
AND table_schema = 'public'
ORDER BY ordinal_position;
