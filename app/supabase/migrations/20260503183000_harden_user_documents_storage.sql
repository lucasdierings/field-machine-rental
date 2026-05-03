-- ============================================================================
-- Hardening de documentos sensíveis (KYC / user_documents)
-- ============================================================================
--
-- Objetivos:
-- 1. Garantir que o bucket user-documents exista e seja privado.
-- 2. Versionar RLS do bucket user-documents, que era usado pelo app mas não
--    tinha políticas no histórico de migrations.
-- 3. Reforçar as políticas do bucket private-kyc aceitando o path canônico
--    `{auth.uid()}/arquivo` e o legado `users/{auth.uid()}/arquivo`.
-- 4. Ativar RLS na tabela user_documents com acesso ao dono e admins.
-- ============================================================================

-- ─── Buckets privados ──────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('user-documents', 'user-documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

INSERT INTO storage.buckets (id, name, public)
VALUES ('private-kyc', 'private-kyc', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- ─── Storage policies: user-documents ──────────────────────────────────────

DROP POLICY IF EXISTS "Users can upload own user documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own user documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own user documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own user documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all user documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage all user documents" ON storage.objects;

CREATE POLICY "Users can upload own user documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own user documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own user documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'user-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own user documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Admins can view all user documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-documents'
  AND public.is_admin()
);

CREATE POLICY "Admins can manage all user documents"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'user-documents'
  AND public.is_admin()
)
WITH CHECK (
  bucket_id = 'user-documents'
  AND public.is_admin()
);

-- ─── Storage policies: private-kyc ─────────────────────────────────────────

DROP POLICY IF EXISTS "Users can upload own KYC docs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own KYC docs" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own KYC docs" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own KYC docs" ON storage.objects;
DROP POLICY IF EXISTS "Admins view all KYC docs" ON storage.objects;
DROP POLICY IF EXISTS "Admins manage all KYC docs" ON storage.objects;

CREATE POLICY "Users can upload own KYC docs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'private-kyc'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR (
      (storage.foldername(name))[1] = 'users'
      AND (storage.foldername(name))[2] = auth.uid()::text
    )
  )
);

CREATE POLICY "Users can view own KYC docs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'private-kyc'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR (
      (storage.foldername(name))[1] = 'users'
      AND (storage.foldername(name))[2] = auth.uid()::text
    )
  )
);

CREATE POLICY "Users can update own KYC docs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'private-kyc'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR (
      (storage.foldername(name))[1] = 'users'
      AND (storage.foldername(name))[2] = auth.uid()::text
    )
  )
)
WITH CHECK (
  bucket_id = 'private-kyc'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR (
      (storage.foldername(name))[1] = 'users'
      AND (storage.foldername(name))[2] = auth.uid()::text
    )
  )
);

CREATE POLICY "Users can delete own KYC docs"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'private-kyc'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR (
      (storage.foldername(name))[1] = 'users'
      AND (storage.foldername(name))[2] = auth.uid()::text
    )
  )
);

CREATE POLICY "Admins view all KYC docs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'private-kyc'
  AND public.is_admin()
);

CREATE POLICY "Admins manage all KYC docs"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'private-kyc'
  AND public.is_admin()
)
WITH CHECK (
  bucket_id = 'private-kyc'
  AND public.is_admin()
);

-- ─── Tabela user_documents ─────────────────────────────────────────────────

ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own documents" ON public.user_documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON public.user_documents;
DROP POLICY IF EXISTS "Users can delete own pending documents" ON public.user_documents;
DROP POLICY IF EXISTS "Admins can view all documents" ON public.user_documents;
DROP POLICY IF EXISTS "Admins can update all documents" ON public.user_documents;

CREATE POLICY "Users can view own documents"
ON public.user_documents
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
ON public.user_documents
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pending documents"
ON public.user_documents
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id
  AND COALESCE(verified, false) = false
);

CREATE POLICY "Admins can view all documents"
ON public.user_documents
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update all documents"
ON public.user_documents
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
