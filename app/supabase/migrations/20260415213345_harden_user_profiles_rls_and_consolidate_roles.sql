-- ============================================================================
-- Hardening de RLS em user_profiles + consolidação de roles administrativas
-- ============================================================================
--
-- CONTEXTO
-- A migration `20260216220000_fix_bookings_visibility.sql` criou a policy
-- `"Public profiles are viewable by everyone" USING (true)` em user_profiles,
-- expondo TODAS as colunas (CPF, email, phone, address) para qualquer
-- requisição (anon e authenticated). Isso viola a LGPD.
--
-- Além disso, o sistema mantém DUAS fontes de verdade para a role
-- administrativa: (a) `user_profiles.user_types[]` que armazena 'admin' como
-- string num array e (b) `user_roles` table normalizada com FK para
-- auth.users. O RPC admin_set_user_verified e algumas RLS policies usam (a),
-- enquanto outras migrations e o hook useUserRole/AuthContext usam (b).
-- Esta migration consolida tudo em (b) e marca user_types[] como puramente
-- "papel funcional na plataforma" (producer/owner — nunca admin).
--
-- O QUE ESTA MIGRATION FAZ
-- 1. Cria função is_admin() que checa user_roles (reutilizável em policies).
-- 2. Migra dados: para todo user com 'admin' em user_types, garante linha em
--    user_roles com role='admin'.
-- 3. Remove 'admin' do user_types (agora é só producer/owner).
-- 4. Recria admin_set_user_verified e a policy "Admins can update all
--    profiles" usando is_admin() em vez de user_types.
-- 5. Reescreve as policies de SELECT em user_profiles para permitir leitura
--    APENAS por:
--       - O próprio usuário (todas as colunas)
--       - Admins (todas as colunas)
--       - Parceiros de booking (renter↔owner — todas as colunas, precisa do
--         contato para combinar a operação P2P)
-- 6. Cria a VIEW user_profiles_public com security_definer (bypass RLS)
--    expondo APENAS colunas seguras (sem CPF, email, phone, address).
--    Frontend usa essa view para reads públicos (nome do dono de máquina,
--    counterpart de chat, etc.).
--
-- IDEMPOTENTE: pode ser rodada mais de uma vez sem efeitos colaterais.
-- ============================================================================

-- ─── 1. Helper function is_admin() ──────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'::app_role
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

COMMENT ON FUNCTION public.is_admin() IS
  'Retorna true se o usuário autenticado tem role admin em public.user_roles. Fonte única de verdade para autorização administrativa.';

-- ─── 2. Migra admins de user_types[] para user_roles ────────────────────────

INSERT INTO public.user_roles (user_id, role)
SELECT auth_user_id, 'admin'::app_role
FROM public.user_profiles
WHERE 'admin' = ANY(user_types)
  AND auth_user_id IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- ─── 3. Remove 'admin' do user_types (vira só producer/owner) ──────────────

UPDATE public.user_profiles
SET user_types = array_remove(user_types, 'admin')
WHERE 'admin' = ANY(user_types);

COMMENT ON COLUMN public.user_profiles.user_types IS
  'Papéis funcionais do usuário na plataforma: producer (produtor rural) e/ou owner (proprietário de máquina). NÃO usar para autorização administrativa — ver public.user_roles.';

-- ─── 4. Recria admin_set_user_verified usando is_admin() ───────────────────

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
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Apenas administradores podem alterar verificação de usuários';
  END IF;

  UPDATE public.user_profiles
  SET verified = is_verified, updated_at = NOW()
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_set_user_verified(UUID, BOOLEAN) TO authenticated;

-- ─── 5. Recria policy de UPDATE para admins usando is_admin() ──────────────

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
CREATE POLICY "Admins can update all profiles"
ON public.user_profiles
FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ─── 6. Reescreve as policies de SELECT em user_profiles ───────────────────

-- Remove a policy permissiva que expunha TUDO publicamente
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;
DROP POLICY IF EXISTS "Anyone can view safe public profile data" ON public.user_profiles;

-- Próprio usuário vê o próprio perfil completo
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = auth_user_id);

-- Admin vê todos os perfis
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
CREATE POLICY "Admins can view all profiles"
ON public.user_profiles
FOR SELECT
USING (public.is_admin());

-- Parceiros de booking podem ver perfil completo do contraparte (precisa do
-- phone/email para combinar a operação P2P).
DROP POLICY IF EXISTS "Booking partners can view profile" ON public.user_profiles;
CREATE POLICY "Booking partners can view profile"
ON public.user_profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE (b.renter_id = auth.uid() AND b.owner_id = user_profiles.auth_user_id)
       OR (b.owner_id  = auth.uid() AND b.renter_id = user_profiles.auth_user_id)
  )
);

-- ─── 7. VIEW pública com colunas seguras ──────────────────────────────────
--
-- Esta view é a ÚNICA forma que anon ou authenticated não-relacionado tem de
-- ler dados de outros perfis. Expõe APENAS colunas não sensíveis.
--
-- IMPORTANTE: criada SEM security_invoker → roda com permissões do owner
-- (postgres), bypassando RLS da tabela base. Como ela só seleciona colunas
-- seguras, é seguro permitir SELECT público nela.

DROP VIEW IF EXISTS public.user_profiles_public;
CREATE VIEW public.user_profiles_public
WITH (security_invoker = false)
AS
SELECT
  id,
  auth_user_id,
  full_name,
  profile_image,
  verified,
  user_types,
  total_rentals,
  total_services,
  total_transactions,
  rating,
  created_at
FROM public.user_profiles;

GRANT SELECT ON public.user_profiles_public TO anon, authenticated;

COMMENT ON VIEW public.user_profiles_public IS
  'Projeção pública e segura de user_profiles. Expõe APENAS colunas não sensíveis (sem CPF, email, phone, address). Use esta view sempre que precisar exibir dados de outro usuário (ex: nome do dono de uma máquina, contraparte de chat). Para acessar phone/email do parceiro de uma booking, use user_profiles direto — a RLS "Booking partners can view profile" autoriza.';

-- ─── 8. Documentação ───────────────────────────────────────────────────────

COMMENT ON TABLE public.user_profiles IS
  'Perfis dos usuários do FieldMachine. Acesso controlado por RLS:
   - Próprio usuário: vê todas as colunas (CPF, email, phone, address).
   - Admin (via public.user_roles role=admin): vê todas as colunas.
   - Parceiro de booking (renter↔owner): vê todas as colunas do contraparte.
   - Outros: SEM acesso direto à tabela. Use public.user_profiles_public.';
