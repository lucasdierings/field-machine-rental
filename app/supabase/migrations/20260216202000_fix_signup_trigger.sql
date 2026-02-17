
-- Fix handle_new_user trigger to handle 'both' user_type and populate all fields
-- This resolves the "Database error saving new user" caused by check constraint violation

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_type text;
  v_user_types text[];
  v_raw_type text;
BEGIN
  -- Extract user_type from metadata
  v_raw_type := NEW.raw_user_meta_data->>'user_type';
  
  -- Handle 'both' case and map to valid constraints
  IF v_raw_type = 'both' THEN
    v_user_type := 'producer'; -- Default primary type for 'both' to satisfy constraint
    v_user_types := ARRAY['producer', 'owner'];
  ELSIF v_raw_type = 'producer' THEN
    v_user_type := 'producer';
    v_user_types := ARRAY['producer'];
  ELSIF v_raw_type = 'owner' THEN
    v_user_type := 'owner';
    v_user_types := ARRAY['owner'];
  ELSE
    -- Default fallback if missing or invalid
    v_user_type := 'producer'; 
    v_user_types := ARRAY['producer'];
  END IF;

  -- Insert into profiles with all data from metadata
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
    v_user_type,
    v_user_types,
    NEW.email_confirmed_at,
    1  -- Começa na etapa 1
  )
  ON CONFLICT (auth_user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    cpf_cnpj = EXCLUDED.cpf_cnpj,
    user_type = EXCLUDED.user_type,
    user_types = EXCLUDED.user_types;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the transaction (optional, but safer for auth)
  -- RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  -- For now, let's re-raise to see it, but the fix above should prevent it.
  RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
