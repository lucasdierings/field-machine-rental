-- Adiciona campos para rastrear conclusão de perfil e verificação de email
-- Permite que usuários pulem etapas do cadastro e completem depois

-- ============================================
-- NOVOS CAMPOS EM user_profiles
-- ============================================

-- Campo para indicar se o perfil foi completado
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;

-- Campo para armazenar quando o email foi verificado (sincronizado com auth.users)
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITH TIME ZONE;

-- Campo para rastrear em qual etapa o usuário parou durante o cadastro
-- 1 = tipo de usuário, 2 = dados básicos, 3 = localização, 4 = sobre você, 5 = verificação
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS profile_completion_step INTEGER DEFAULT 1;

-- Campo para armazenar tipos de usuário como array (producer, owner, ou ambos)
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS user_types TEXT[] DEFAULT ARRAY[]::TEXT[];

-- ============================================
-- COMENTÁRIOS EXPLICATIVOS
-- ============================================

COMMENT ON COLUMN public.user_profiles.profile_completed IS 'Indica se o usuário completou todas as etapas do cadastro';
COMMENT ON COLUMN public.user_profiles.email_verified_at IS 'Data/hora em que o email foi verificado (sincronizado com auth.users)';
COMMENT ON COLUMN public.user_profiles.profile_completion_step IS 'Última etapa completada no fluxo de cadastro (1-5)';
COMMENT ON COLUMN public.user_profiles.user_types IS 'Tipos de usuário: producer, owner, ou ambos';

-- ============================================
-- FUNÇÃO PARA SINCRONIZAR email_verified_at
-- ============================================

-- Atualiza email_verified_at quando o email é confirmado no auth.users
CREATE OR REPLACE FUNCTION public.sync_email_verification()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o email foi confirmado e ainda não foi sincronizado
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    UPDATE public.user_profiles
    SET email_verified_at = NEW.email_confirmed_at
    WHERE auth_user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove trigger existente se houver
DROP TRIGGER IF EXISTS on_auth_user_email_verified ON auth.users;

-- Cria trigger para sincronizar verificação de email
CREATE TRIGGER on_auth_user_email_verified
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL)
  EXECUTE FUNCTION public.sync_email_verification();

-- ============================================
-- ATUALIZAR FUNÇÃO handle_new_user
-- ============================================

-- Atualiza a função de criação automática de perfil para incluir novos campos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    auth_user_id, 
    full_name,
    email_verified_at,
    profile_completion_step
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email_confirmed_at,
    1  -- Começa na etapa 1
  )
  ON CONFLICT (auth_user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- MIGRAR DADOS EXISTENTES
-- ============================================

-- Sincroniza email_verified_at para usuários existentes
UPDATE public.user_profiles up
SET email_verified_at = au.email_confirmed_at
FROM auth.users au
WHERE up.auth_user_id = au.id
  AND au.email_confirmed_at IS NOT NULL
  AND up.email_verified_at IS NULL;

-- Marca perfis existentes como completos (assumindo que já passaram pelo fluxo antigo)
UPDATE public.user_profiles
SET profile_completed = TRUE,
    profile_completion_step = 5
WHERE profile_completed = FALSE
  AND full_name IS NOT NULL
  AND full_name != '';
