-- FIX: Garante que usuários autenticados possam inserir máquinas
-- Rode este script no SQL Editor do Supabase se o cadastro de máquinas falhar com erro de RLS.

-- 1. Garante que RLS está habilitado
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;

-- 2. Remove TODAS as policies de INSERT antigas (qualquer variação de nome)
DROP POLICY IF EXISTS "Users can insert their own machines" ON public.machines;
DROP POLICY IF EXISTS "Authenticated users can insert machines" ON public.machines;
DROP POLICY IF EXISTS "Authenticated users can insert their own machines" ON public.machines;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.machines;

-- 3. Cria a policy de INSERT definitiva
CREATE POLICY "Authenticated users can insert their own machines"
ON public.machines
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

-- 4. Garante policy de UPDATE
DROP POLICY IF EXISTS "Users can update their own machines" ON public.machines;
CREATE POLICY "Users can update their own machines"
ON public.machines
FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- 5. Garante policy de DELETE
DROP POLICY IF EXISTS "Users can delete their own machines" ON public.machines;
CREATE POLICY "Users can delete their own machines"
ON public.machines
FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

-- 6. Garante policy de SELECT (todos podem ver)
DROP POLICY IF EXISTS "Public machines are viewable by everyone" ON public.machines;
DROP POLICY IF EXISTS "Anyone can view machines" ON public.machines;
CREATE POLICY "Anyone can view machines"
ON public.machines
FOR SELECT
USING (true);

-- 7. Garante as colunas necessárias
ALTER TABLE public.machines
ADD COLUMN IF NOT EXISTS operator_type text DEFAULT 'owner',
ADD COLUMN IF NOT EXISTS service_cities text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS specifications jsonb DEFAULT '{}'::jsonb;

-- 8. Mesma coisa para machine_images
ALTER TABLE public.machine_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Machine images are viewable by everyone" ON public.machine_images;
CREATE POLICY "Machine images are viewable by everyone"
ON public.machine_images FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert images for their machines" ON public.machine_images;
CREATE POLICY "Users can insert images for their machines"
ON public.machine_images FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.machines
        WHERE id = machine_images.machine_id
        AND owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can update images for their machines" ON public.machine_images;
CREATE POLICY "Users can update images for their machines"
ON public.machine_images FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.machines
        WHERE id = machine_images.machine_id
        AND owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can delete images for their machines" ON public.machine_images;
CREATE POLICY "Users can delete images for their machines"
ON public.machine_images FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.machines
        WHERE id = machine_images.machine_id
        AND owner_id = auth.uid()
    )
);

-- 9. Storage bucket para imagens
INSERT INTO storage.buckets (id, name, public)
VALUES ('machine-images', 'machine-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;
