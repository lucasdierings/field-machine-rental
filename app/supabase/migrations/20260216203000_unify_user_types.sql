
-- Unify User Types
-- 1. Ensure the column exists (it might be missing in some schema versions)
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS user_type text DEFAULT 'producer';

-- 2. Drop the checking constraint on user_type if it exists to allow flexibility
DO $$
DECLARE
    con_name text;
BEGIN
    SELECT constraint_name INTO con_name
    FROM information_schema.check_constraints
    WHERE constraint_name = 'user_profiles_user_type_check';
    
    IF con_name IS NOT NULL THEN
        ALTER TABLE public.user_profiles DROP CONSTRAINT user_profiles_user_type_check;
    END IF;
END $$;

-- 3. Update all existing users to have both capabilities
UPDATE public.user_profiles
SET user_types = ARRAY['producer', 'owner'],
    user_type = 'producer'; -- Keep 'producer' as a safe legacy default string

-- 4. Set defaults for new columns
ALTER TABLE public.user_profiles
ALTER COLUMN user_types SET DEFAULT ARRAY['producer', 'owner']::text[],
ALTER COLUMN user_type SET DEFAULT 'producer';

-- 5. Update the handle_new_user trigger to always assign full permissions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    auth_user_id, 
    full_name,
    phone,
    cpf_cnpj,
    user_type,
    user_types,
    email_verified_at,
    profile_completion_step
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'cpf_cnpj',
    'producer', -- Default legacy value
    ARRAY['producer', 'owner'], -- Everyone is both
    NEW.email_confirmed_at,
    1
  )
  ON CONFLICT (auth_user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    cpf_cnpj = EXCLUDED.cpf_cnpj,
    user_types = ARRAY['producer', 'owner'];
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
