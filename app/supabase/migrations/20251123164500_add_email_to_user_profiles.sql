-- Add email column to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- Update handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    auth_user_id,
    full_name,
    email,
    email_verified_at,
    profile_completion_step
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    NEW.email_confirmed_at,
    1  -- Começa na etapa 1
  )
  ON CONFLICT (auth_user_id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    email_verified_at = EXCLUDED.email_verified_at;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Backfill script (Run this manually in Supabase SQL Editor if needed)
-- UPDATE public.user_profiles up
-- SET email = au.email
-- FROM auth.users au
-- WHERE up.auth_user_id = au.id
-- AND up.email IS NULL;
