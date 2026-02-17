-- Corrigir políticas RLS da tabela machines
-- Primeiro, remover as políticas antigas
DROP POLICY IF EXISTS "Authenticated users can insert machines" ON public.machines;
DROP POLICY IF EXISTS "Users can update their own machines" ON public.machines;
DROP POLICY IF EXISTS "Users can delete their own machines" ON public.machines;

-- Remover a coluna auth_owner_id duplicada (vamos usar apenas owner_id)
ALTER TABLE public.machines DROP COLUMN IF EXISTS auth_owner_id;

-- Criar novas políticas RLS corretas
CREATE POLICY "Authenticated users can insert their own machines" 
ON public.machines 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own machines" 
ON public.machines 
FOR UPDATE 
TO authenticated
USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own machines" 
ON public.machines 
FOR DELETE 
TO authenticated
USING (auth.uid() = owner_id);

-- Verificar e corrigir políticas de outras tabelas críticas
-- Tabela machine_bookings está OK

-- Tabela alerts está OK

-- Tabela user_profiles está OK