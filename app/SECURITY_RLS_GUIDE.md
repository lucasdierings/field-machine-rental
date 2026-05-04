# 🔐 Guia de Configuração de RLS (Row Level Security) - Supabase

Este guia contém as políticas de segurança **CRÍTICAS** que devem ser configuradas no Supabase antes de lançar em produção.

⚠️ **ATENÇÃO:** Sem RLS ativado, qualquer usuário pode acessar/modificar dados de outros usuários!

---

## ✅ Checklist de Segurança

- [ ] RLS habilitado em **TODAS** as tabelas
- [ ] Políticas de SELECT (leitura) configuradas
- [ ] Políticas de INSERT (criação) configuradas
- [ ] Políticas de UPDATE (atualização) configuradas
- [ ] Políticas de DELETE (exclusão) configuradas
- [ ] Testado com múltiplos usuários

---

## 📋 Tabelas que precisam de RLS

### 1. **user_profiles** (Dados do usuário)

```sql
-- Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- SELECT: Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = auth_user_id);

-- INSERT: Apenas o próprio usuário pode criar seu perfil
CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = auth_user_id);

-- UPDATE: Apenas o próprio usuário pode atualizar seu perfil
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = auth_user_id);

-- DELETE: Apenas o próprio usuário pode deletar seu perfil
CREATE POLICY "Users can delete own profile"
ON user_profiles FOR DELETE
USING (auth.uid() = auth_user_id);
```

---

### 2. **user_roles** (Permissões de usuário)

```sql
-- Habilitar RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- SELECT: Usuários podem ver apenas suas próprias roles
CREATE POLICY "Users can view own roles"
ON user_roles FOR SELECT
USING (auth.uid() = user_id);

-- INSERT/UPDATE/DELETE: Apenas admins podem modificar roles
CREATE POLICY "Only admins can manage roles"
ON user_roles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

---

### 3. **machines** (Máquinas anunciadas)

```sql
-- Habilitar RLS
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;

-- SELECT: Todos podem ver máquinas ativas
CREATE POLICY "Anyone can view active machines"
ON machines FOR SELECT
USING (
  status = 'active' OR
  owner_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- INSERT: Apenas usuários autenticados podem criar máquinas
CREATE POLICY "Authenticated users can insert machines"
ON machines FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- UPDATE: Apenas o dono ou admin pode atualizar
CREATE POLICY "Owners and admins can update machines"
ON machines FOR UPDATE
USING (
  owner_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- DELETE: Apenas o dono ou admin pode deletar
CREATE POLICY "Owners and admins can delete machines"
ON machines FOR DELETE
USING (
  owner_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

---

### 4. **bookings** (Reservas)

```sql
-- Habilitar RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- SELECT: Apenas proprietário, locatário ou admin podem ver
CREATE POLICY "Users can view own bookings"
ON bookings FOR SELECT
USING (
  renter_id = auth.uid() OR
  machine_id IN (
    SELECT id FROM machines WHERE owner_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- INSERT: Apenas locatários autenticados podem criar reservas
CREATE POLICY "Authenticated users can create bookings"
ON bookings FOR INSERT
WITH CHECK (auth.uid() = renter_id);

-- UPDATE: Apenas o locatário, proprietário da máquina ou admin
CREATE POLICY "Related users can update bookings"
ON bookings FOR UPDATE
USING (
  renter_id = auth.uid() OR
  machine_id IN (
    SELECT id FROM machines WHERE owner_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- DELETE: Apenas admin pode deletar reservas
CREATE POLICY "Only admins can delete bookings"
ON bookings FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

---

### 5. **messages** (Mensagens entre usuários)

```sql
-- Habilitar RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- SELECT: Apenas remetente e destinatário podem ver
CREATE POLICY "Users can view own messages"
ON messages FOR SELECT
USING (
  sender_id = auth.uid() OR
  receiver_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- INSERT: Apenas usuários autenticados podem enviar mensagens
CREATE POLICY "Authenticated users can send messages"
ON messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- UPDATE/DELETE: Apenas o remetente pode editar/deletar
CREATE POLICY "Senders can update own messages"
ON messages FOR UPDATE
USING (sender_id = auth.uid());

CREATE POLICY "Senders can delete own messages"
ON messages FOR DELETE
USING (sender_id = auth.uid());
```

---

### 6. **reviews** (Avaliações)

```sql
-- Habilitar RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- SELECT: Todos podem ver avaliações
CREATE POLICY "Anyone can view reviews"
ON reviews FOR SELECT
USING (true);

-- INSERT: Apenas o locatário pode criar avaliação após reserva concluída
CREATE POLICY "Renters can create reviews after booking"
ON reviews FOR INSERT
WITH CHECK (
  auth.uid() = reviewer_id AND
  EXISTS (
    SELECT 1 FROM bookings
    WHERE id = booking_id
      AND renter_id = auth.uid()
      AND status = 'completed'
  )
);

-- UPDATE: Apenas o autor da avaliação pode editar (dentro de 48h)
CREATE POLICY "Reviewers can update own recent reviews"
ON reviews FOR UPDATE
USING (
  reviewer_id = auth.uid() AND
  created_at > NOW() - INTERVAL '48 hours'
);

-- DELETE: Apenas admin ou autor (dentro de 24h)
CREATE POLICY "Reviewers and admins can delete reviews"
ON reviews FOR DELETE
USING (
  reviewer_id = auth.uid() AND created_at > NOW() - INTERVAL '24 hours' OR
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

---

### 7. **documents** (Documentos de verificação)

```sql
-- Habilitar RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- SELECT: Apenas o dono ou admin podem ver
CREATE POLICY "Users can view own documents"
ON documents FOR SELECT
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- INSERT: Apenas o próprio usuário pode enviar documentos
CREATE POLICY "Users can upload own documents"
ON documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Apenas admin pode aprovar/rejeitar
CREATE POLICY "Only admins can update documents"
ON documents FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- DELETE: Apenas o dono ou admin
CREATE POLICY "Users and admins can delete documents"
ON documents FOR DELETE
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

---

## 🧪 Como Testar RLS

### 1. Via Dashboard do Supabase

```sql
-- Testar como usuário específico
SELECT * FROM user_profiles;
-- Deve retornar apenas o perfil do usuário logado

-- Testar tentativa de acesso não autorizado
SELECT * FROM user_profiles WHERE auth_user_id != auth.uid();
-- Deve retornar vazio (não mostra dados de outros usuários)
```

### 2. Via Aplicação

1. Crie dois usuários diferentes
2. Faça login com Usuário A
3. Tente acessar dados do Usuário B
4. Deve ser bloqueado pelo RLS

### 3. Checklist de Testes

- [ ] Usuário não consegue ver perfil de outros usuários
- [ ] Usuário não consegue editar máquinas de outros
- [ ] Usuário não consegue ver mensagens de outros
- [ ] Usuário não consegue ver documentos de outros
- [ ] Admin consegue acessar todos os dados
- [ ] Usuário não autenticado não consegue criar dados

---

## 🚨 Políticas Especiais

### Storage (Imagens de máquinas e documentos)

```sql
-- Bucket: machine-images
-- SELECT: Todos podem ver
CREATE POLICY "Anyone can view machine images"
ON storage.objects FOR SELECT
USING (bucket_id = 'machine-images');

-- INSERT: Apenas donos autenticados
CREATE POLICY "Authenticated users can upload machine images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'machine-images' AND
  auth.role() = 'authenticated'
);

-- DELETE: Apenas o dono da máquina ou admin
CREATE POLICY "Owners can delete machine images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'machine-images' AND
  (
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM machines WHERE owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
);

-- Bucket: user-documents (PRIVADO!)
-- SELECT: Apenas o dono ou admin
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'user-documents' AND
  (
    (storage.foldername(name))[1] = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
);

-- INSERT: Apenas o próprio usuário
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## ⚠️ Erros Comuns

### 1. **"new row violates row-level security policy"**
- Causa: Tentando inserir dados sem permissão
- Solução: Verificar se `auth.uid()` corresponde ao `user_id`/`owner_id`

### 2. **Queries retornando vazio**
- Causa: RLS bloqueando acesso
- Solução: Verificar se políticas de SELECT estão corretas

### 3. **Admin não consegue acessar tudo**
- Causa: Falta política para role `admin`
- Solução: Adicionar `EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')` nas políticas

---

## 📚 Referências

- [Documentação RLS - Supabase](https://supabase.com/docs/guides/auth/row-level-security)
- [Exemplos de Políticas](https://supabase.com/docs/guides/database/postgres/row-level-security#examples)
- [Debugging RLS](https://supabase.com/docs/guides/database/postgres/row-level-security#debugging-rls)

---

## ✅ Após Configurar

1. Ativar RLS em todas as tabelas
2. Executar todos os scripts SQL acima
3. Testar com múltiplos usuários
4. Verificar logs de erro no Supabase Dashboard
5. Documentar qualquer política customizada adicional

**🔒 Segurança é prioridade! Não pule esta etapa.**
