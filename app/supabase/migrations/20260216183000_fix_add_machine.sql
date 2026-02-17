-- FIX SCRIPT: Run this in Supabase SQL Editor to fix Machine Registration

-- 1. Ensure 'operator_type' column exists (it might be missing)
ALTER TABLE public.machines ADD COLUMN IF NOT EXISTS operator_type text DEFAULT 'owner';

-- 2. Ensure 'specifications' column exists
ALTER TABLE public.machines ADD COLUMN IF NOT EXISTS specifications jsonb DEFAULT '{}'::jsonb;

-- 3. Fix RLS Policies for 'machines' table
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;

-- Allow users to view all available machines (already likely exists, but ensuring)
CREATE POLICY "Public machines are viewable by everyone" 
ON public.machines FOR SELECT 
USING (true);

-- Allow authenticated users to insert their own machines
DROP POLICY IF EXISTS "Users can insert their own machines" ON public.machines;
CREATE POLICY "Users can insert their own machines" 
ON public.machines FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

-- Allow users to update their own machines
DROP POLICY IF EXISTS "Users can update their own machines" ON public.machines;
CREATE POLICY "Users can update their own machines" 
ON public.machines FOR UPDATE 
USING (auth.uid() = owner_id);

-- 4. Fix RLS Policies for 'machine_images' table
ALTER TABLE public.machine_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Machine images are viewable by everyone" ON public.machine_images;
CREATE POLICY "Machine images are viewable by everyone" 
ON public.machine_images FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can insert images for their machines" ON public.machine_images;
CREATE POLICY "Users can insert images for their machines" 
ON public.machine_images FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.machines 
        WHERE id = machine_images.machine_id 
        AND owner_id = auth.uid()
    )
);

-- 5. Fix Storage Policies (Bucket 'machine-images')
-- Note: Storage policies are often handled in the Storage UI, but we can try via SQL if the extension is enabled.
-- If this fails, you may need to set 'Public' to true in the Storage Bucket settings manually.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('machine-images', 'machine-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public View" ON storage.objects;
CREATE POLICY "Public View"
ON storage.objects FOR SELECT
USING ( bucket_id = 'machine-images' );

DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'machine-images' AND auth.role() = 'authenticated' );
