-- CRIAR TABELA DE COMPRAS
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tabela purchases
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_id TEXT UNIQUE NOT NULL,
    supplier_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    items_description TEXT,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status TEXT CHECK (status IN ('Pending', 'Received', 'Cancelled')) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_purchases_supplier ON public.purchases(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON public.purchases(date);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON public.purchases(status);

-- 3. Habilitar RLS
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas RLS
CREATE POLICY "Admins can do everything on purchases"
ON public.purchases
FOR ALL
USING (public.is_admin());

CREATE POLICY "Users can view purchases"
ON public.purchases
FOR SELECT
USING (true);

-- 5. Criar função para gerar display_id automaticamente
CREATE OR REPLACE FUNCTION generate_purchase_display_id()
RETURNS TRIGGER AS $$
DECLARE
  next_number INTEGER;
BEGIN
  -- Get the next number by counting existing purchases + 1
  SELECT COALESCE(MAX(CAST(SUBSTRING(display_id FROM 5) AS INTEGER)), 4900) + 1
  INTO next_number
  FROM public.purchases
  WHERE display_id LIKE '#PO-%';
  
  -- Generate the display_id
  NEW.display_id := '#PO-' || next_number::TEXT;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Criar trigger para gerar display_id
CREATE TRIGGER set_purchase_display_id
BEFORE INSERT ON public.purchases
FOR EACH ROW
WHEN (NEW.display_id IS NULL)
EXECUTE FUNCTION generate_purchase_display_id();

-- Confirmação
SELECT 'Tabela purchases criada com sucesso!' as status;
