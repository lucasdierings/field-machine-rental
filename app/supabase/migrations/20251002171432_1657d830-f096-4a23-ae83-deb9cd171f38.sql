-- Atualizar categorias de máquinas e serviços
-- Adicionar novas categorias: Tratores, Implementos, Pulverizadores, Colheitadeiras, Caminhões, Cegonhas, Agricultura de Precisão

-- Não há enum de categorias, então não precisamos alterar constraints
-- As categorias são armazenadas como TEXT

-- Atualizar user_type para permitir múltiplos tipos
-- Modificar user_profiles para aceitar array de tipos
ALTER TABLE user_profiles 
DROP COLUMN IF EXISTS user_type;

ALTER TABLE user_profiles
ADD COLUMN user_types TEXT[] DEFAULT ARRAY[]::TEXT[];

COMMENT ON COLUMN user_profiles.user_types IS 'Tipos de usuário: producer (produtor rural), service_provider (prestador de serviço). Usuários podem ter múltiplos tipos.';