-- Criar bucket private-kyc se não existir
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'private-kyc') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('private-kyc', 'private-kyc', false);
  END IF;
END $$;

-- Remover políticas existentes que podem causar recursão
DROP POLICY IF EXISTS "Users can upload their own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage all KYC documents" ON storage.objects;

-- Políticas simplificadas para o bucket private-kyc (SEM recursão)
-- Os usuários podem fazer upload apenas em sua própria pasta
CREATE POLICY "Users can upload own KYC docs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'private-kyc' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Os usuários podem visualizar apenas seus próprios documentos
CREATE POLICY "Users can view own KYC docs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'private-kyc' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Os usuários podem atualizar apenas seus próprios documentos
CREATE POLICY "Users can update own KYC docs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'private-kyc' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Os usuários podem deletar apenas seus próprios documentos
CREATE POLICY "Users can delete own KYC docs"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'private-kyc' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins podem ver todos os documentos (usando função sem recursão)
CREATE POLICY "Admins view all KYC docs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'private-kyc' 
  AND is_admin()
);

-- Admins podem gerenciar todos os documentos
CREATE POLICY "Admins manage all KYC docs"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'private-kyc' 
  AND is_admin()
)
WITH CHECK (
  bucket_id = 'private-kyc' 
  AND is_admin()
);
