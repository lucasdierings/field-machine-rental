-- Create admin function to toggle user verification
-- Uses SECURITY DEFINER to bypass RLS, with is_admin() check for authorization

CREATE OR REPLACE FUNCTION public.admin_set_user_verified(
  target_user_id UUID,
  is_verified BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE auth_user_id = auth.uid() 
    AND 'admin' = ANY(user_types)
  ) THEN
    RAISE EXCEPTION 'Apenas administradores podem alterar verificação de usuários';
  END IF;

  -- Update the target user's verified status
  UPDATE user_profiles
  SET verified = is_verified, updated_at = NOW()
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;
END;
$$;

-- Grant execute to authenticated users (admin check is inside the function)
GRANT EXECUTE ON FUNCTION public.admin_set_user_verified(UUID, BOOLEAN) TO authenticated;

-- Also add an RLS policy so admins can update any user_profiles row
-- This is a safety net for other admin operations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Admins can update all profiles'
  ) THEN
    CREATE POLICY "Admins can update all profiles"
    ON public.user_profiles
    FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM user_profiles up
        WHERE up.auth_user_id = auth.uid()
        AND 'admin' = ANY(up.user_types)
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM user_profiles up
        WHERE up.auth_user_id = auth.uid()
        AND 'admin' = ANY(up.user_types)
      )
    );
  END IF;
END;
$$;
