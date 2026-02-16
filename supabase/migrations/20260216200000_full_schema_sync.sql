-- Full Schema Sync and Validation
-- This script ensures all necessary tables, columns, and policies exist.
-- It is designed to be safe to run multiple times (idempotent).

-- 1. Ensure 'user_profiles' has all columns
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS profile_image text,
ADD COLUMN IF NOT EXISTS user_types text[] DEFAULT ARRAY['producer', 'owner']::text[],
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS cpf_cnpj text;

-- Update existing users to unified 'user_types' if missing or single
UPDATE public.user_profiles 
SET user_types = ARRAY['producer', 'owner']
WHERE user_types IS NULL OR array_length(user_types, 1) < 2;

-- 2. Ensure 'machines' has all columns
ALTER TABLE public.machines 
ADD COLUMN IF NOT EXISTS service_cities text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS operator_type text DEFAULT 'owner',
ADD COLUMN IF NOT EXISTS location jsonb DEFAULT '{"city": "", "state": "", "address": ""}'::jsonb;

-- Ensure GIN index for service_cities exists
CREATE INDEX IF NOT EXISTS idx_machines_service_cities ON public.machines USING GIN(service_cities);

-- 3. Storage Configuration for 'avatars'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- RLS for Avatars (Drop and Recreate to be safe)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY; -- Usually enabled by default and requires superuser

DROP POLICY IF EXISTS "Public avatars view" ON storage.objects;
CREATE POLICY "Public avatars view" ON storage.objects FOR SELECT USING ( bucket_id = 'avatars' );

DROP POLICY IF EXISTS "Authenticated avatar upload" ON storage.objects;
CREATE POLICY "Authenticated avatar upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING ( bucket_id = 'avatars' AND auth.uid() = owner );

DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar" ON storage.objects FOR DELETE USING ( bucket_id = 'avatars' AND auth.uid() = owner );

-- 4. Fix User Deletion Constraint (Cascade)
-- Re-apply logic to ensure foreign key on user_documents is correct
DO $$
DECLARE
    fk_name text;
BEGIN
    SELECT constraint_name INTO fk_name
    FROM information_schema.key_column_usage
    WHERE table_name = 'user_documents' 
    AND column_name = 'user_id' 
    AND table_schema = 'public';

    IF fk_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.user_documents DROP CONSTRAINT ' || fk_name;
    END IF;
    
    -- Re-add constraint (ensure it doesn't already exist with same name which we just dropped, but to be sure)
    EXECUTE 'ALTER TABLE public.user_documents ADD CONSTRAINT user_documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE';
EXCEPTION WHEN duplicate_object THEN
    -- If it exists, we assume it is correct or we can force drop and create if needed.
    -- For now, let's just log or ignore.
    NULL;
END $$;

-- 5. Helper Tables (Countries, States, Cities) check
-- We assume the massive seed script might have been run or will be run.
-- Just creating tables if they don't exist to prevent errors if seed wasn't run.
CREATE TABLE IF NOT EXISTS public.countries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.states (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    country_id uuid REFERENCES public.countries(id) ON DELETE CASCADE,
    UNIQUE(name, country_id)
);

CREATE TABLE IF NOT EXISTS public.cities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    state_id uuid REFERENCES public.states(id) ON DELETE CASCADE,
    ibge_code text,
    UNIQUE(name, state_id)
);

-- RLS for Helper Tables
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read countries" ON public.countries;
CREATE POLICY "Public read countries" ON public.countries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read states" ON public.states;
CREATE POLICY "Public read states" ON public.states FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read cities" ON public.cities;
CREATE POLICY "Public read cities" ON public.cities FOR SELECT USING (true);

