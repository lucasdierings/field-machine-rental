
-- Permitir que usuários autenticados criem seu próprio perfil
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = auth_user_id);

-- Permitir que usuários autenticados atualizem seu próprio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = auth_user_id);

-- Permitir que usuários vejam seu próprio perfil (e opcionalmente perfis públicos se necessário)
-- Por enquanto, vamos manter restrito ao próprio usuário para edição, 
-- mas se precisar exibir perfil público de máquinas, precisaremos de outra policy.
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = auth_user_id);
