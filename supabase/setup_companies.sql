-- SCRIPT PARA CONFIGURAR AS EMPRESAS
-- Execute este script no SQL Editor do Supabase

-- 1. Limpar empresas existentes (exceto a padrão se quiser manter)
DELETE FROM public.companies WHERE name != 'VisuLab HQ';

-- 2. Atualizar a empresa padrão para Master
UPDATE public.companies 
SET name = 'Master', 
    type = 'Matriz',
    contact_name = 'Administrador',
    contact_email = 'admin@master.com'
WHERE name = 'VisuLab HQ';

-- 3. Inserir as novas empresas
INSERT INTO public.companies (name, type, status, contact_name, contact_email) VALUES
('AMX', 'Filial', 'Active', 'Gerente AMX', 'contato@amx.com'),
('Ultra Optics', 'Fornecedor', 'Active', 'Vendedor Ultra', 'vendas@ultraoptics.com'),
('GBO', 'Fornecedor', 'Active', 'Vendedor GBO', 'vendas@gbo.com');

-- 4. Verificar as empresas criadas
SELECT id, name, type, status FROM public.companies ORDER BY 
  CASE type 
    WHEN 'Matriz' THEN 1 
    WHEN 'Filial' THEN 2 
    WHEN 'Fornecedor' THEN 3 
  END, name;
