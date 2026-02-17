-- Adiciona política RLS para bloquear criação de bookings sem email verificado
-- Garante que apenas usuários com email confirmado possam criar reservas

-- ============================================
-- POLÍTICA RLS PARA machine_bookings
-- ============================================

-- Remove política antiga se existir
DROP POLICY IF EXISTS "Verified users can create bookings" ON public.machine_bookings;

-- Cria nova política que exige email verificado
CREATE POLICY "Verified users can create bookings"
ON public.machine_bookings
FOR INSERT
WITH CHECK (
  auth.uid() = renter_id 
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email_confirmed_at IS NOT NULL
  )
);

-- ============================================
-- FUNÇÃO HELPER PARA VERIFICAR EMAIL
-- ============================================

-- Função para verificar se o usuário atual tem email verificado
CREATE OR REPLACE FUNCTION public.is_email_verified()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email_confirmed_at IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.is_email_verified() IS 'Retorna TRUE se o usuário autenticado tem email verificado';

-- Grant execute para authenticated users
GRANT EXECUTE ON FUNCTION public.is_email_verified() TO authenticated;

-- ============================================
-- FUNÇÃO PARA OBTER STATUS DE VERIFICAÇÃO
-- ============================================

-- Função para obter informações completas de verificação do usuário
CREATE OR REPLACE FUNCTION public.get_verification_status()
RETURNS TABLE (
  email_verified BOOLEAN,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  profile_completed BOOLEAN,
  profile_completion_step INTEGER,
  can_create_booking BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (au.email_confirmed_at IS NOT NULL) as email_verified,
    au.email_confirmed_at as email_verified_at,
    COALESCE(up.profile_completed, FALSE) as profile_completed,
    COALESCE(up.profile_completion_step, 1) as profile_completion_step,
    (au.email_confirmed_at IS NOT NULL) as can_create_booking
  FROM auth.users au
  LEFT JOIN public.user_profiles up ON up.auth_user_id = au.id
  WHERE au.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.get_verification_status() IS 'Retorna status completo de verificação e conclusão de perfil do usuário autenticado';

-- Grant execute para authenticated users
GRANT EXECUTE ON FUNCTION public.get_verification_status() TO authenticated;
