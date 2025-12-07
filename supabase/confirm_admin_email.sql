-- SCRIPT PARA CONFIRMAR O EMAIL DO ADMIN MANUALMENTE (CORRIGIDO)
-- Execute este script no SQL Editor do Supabase

-- Confirmar o email do usuário admin (apenas email_confirmed_at)
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'admin@visulab.com';

-- Verificar se foi atualizado
SELECT id, email, email_confirmed_at, confirmed_at 
FROM auth.users 
WHERE email = 'admin@visulab.com';
