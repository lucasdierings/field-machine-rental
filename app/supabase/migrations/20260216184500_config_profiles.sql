-- Database Configuration for Profile Images and User Types

-- 1. Create 'avatars' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Set up RLS policies for 'avatars' bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to avatars
DROP POLICY IF EXISTS "Public avatars view" ON storage.objects;
CREATE POLICY "Public avatars view"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Allow authenticated users to upload avatars
DROP POLICY IF EXISTS "Authenticated avatar upload" ON storage.objects;
CREATE POLICY "Authenticated avatar upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- Allow users to update/delete their own avatars
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' AND auth.uid() = owner );

DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING ( bucket_id = 'avatars' AND auth.uid() = owner );

-- 3. Ensure user_profiles has profile_image column
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS profile_image text;

-- 4. Update existing users to be type 'both' (producer + owner) if we want to unify them
-- This makes everyone capable of everything
UPDATE public.user_profiles 
SET user_types = ARRAY['producer', 'owner'],
    user_type = 'producer' -- Default primary type, doesn't matter much if logic ignores it
WHERE user_types IS NULL OR array_length(user_types, 1) < 2;
