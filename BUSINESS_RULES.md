# 📋 Regras de Negócio - Field Machine Rental

**Versão**: 1.0
**Data**: Fevereiro 2026
**Projeto**: Platform de Aluguel de Máquinas Agrícolas

---

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Atores e Roles](#atores-e-roles)
3. [Entidades Principais](#entidades-principais)
4. [Regras de Cadastro](#regras-de-cadastro)
5. [Regras de Busca e Filtros](#regras-de-busca-e-filtros)
6. [Regras de Máquinas](#regras-de-máquinas)
7. [Regras de Reservas (Bookings)](#regras-de-reservas-bookings)
8. [Regras de Preços](#regras-de-preços)
9. [Regras de Avaliações](#regras-de-avaliações)
10. [Regras de Segurança](#regras-de-segurança)
11. [Regras de Pagamento](#regras-de-pagamento)
12. [Regras Administrativas](#regras-administrativas)

---

## 🎯 Visão Geral

**Field Machine Rental** é um marketplace B2C de aluguel de máquinas agrícolas que conecta:
- **Proprietários/Prestadores**: Donos de máquinas que alugam equipamentos
- **Rentadores/Produtores**: Agricultores que precisam alugar máquinas para operações

**Objetivo**: Facilitar a conexão entre oferta e demanda de máquinas agrícolas, reduzindo custos para produtores e gerando receita para proprietários.

---

## 👥 Atores e Roles

### 1. **Admin**
- **Acesso**: `/admin` (protegido)
- **Permissões**:
  - Visualizar todas as máquinas, usuários e reservas da plataforma
  - Aprovar/rejeitar documentos de usuários
  - Visualizar analytics e estatísticas
  - Gerenciar plataforma
- **Identificação**: Usuário com `role = 'admin'` na tabela `user_roles`

### 2. **Proprietário/Prestador de Serviço**
- **Identificação**: Usuário que cadastrou máquinas
- **Permissões**:
  - Adicionar, editar e remover máquinas
  - Visualizar solicitações de aluguel recebidas
  - Aceitar ou rejeitar reservas
  - Comunicar com rentadores via chat
  - Receber avaliações após conclusão de aluguel
  - Editar perfil e documentos
- **Restrições**:
  - Não pode editar dados de outros proprietários
  - Não pode acessar histórico de reservas de outros

### 3. **Rentador/Produtor Rural**
- **Identificação**: Usuário sem máquinas cadastradas (ou que busca alugar)
- **Permissões**:
  - Buscar máquinas com filtros avançados
  - Visualizar detalhes e imagens de máquinas
  - Solicitar aluguel (criar booking)
  - Comunicar com proprietários via chat
  - Favoritar máquinas
  - Criar alertas de busca
  - Avaliar proprietário após conclusão
- **Restrições**:
  - Não pode acessar máquinas de outros usuários
  - Não pode cancelar reserva após início (sem justificativa admin)

### 4. **Usuário Anônimo**
- **Permissões**:
  - Ver home page, landing pages
  - Buscar máquinas (com raio limitado)
  - Ver detalhes de máquinas
  - Ver avaliações públicas
- **Restrições**:
  - Não pode fazer reservas sem cadastro
  - Não pode fazer upload de máquinas
  - Não pode acessar dashboard pessoal

---

## 📊 Entidades Principais

### Usuário (`user_profiles`)
```
- id: UUID (chave primária)
- auth_user_id: UUID (FK para auth.users)
- full_name: String (obrigatório)
- email: String (obrigatório, único)
- phone: String (obrigatório)
- cpf_cnpj: String (obrigatório, validado)
- profile_picture_url: String (opcional)
- rating: Float (média de avaliações, padrão 0)
- verified: Boolean (verificação de documentos, padrão false)
- profile_completion_percentage: Integer (0-100, padrão 0)
- created_at: Timestamp
- updated_at: Timestamp
```

### Máquina (`machines`)
```
- id: UUID (chave primária)
- owner_id: UUID (FK para user_profiles)
- name: String (obrigatório, ex: "Colheitadeira Case IH 8590")
- brand: String (obrigatório, ex: "Case IH")
- model: String (obrigatório, ex: "8590")
- year: Integer (obrigatório, >= 1990)
- category: Enum (Trator, Colheitadeira, Pulverizador, Plantadeira, Implemento, Transporte)
- description: String (opcional)
- horsepower: Integer (potência em CV, opcional)
- weight: Float (peso em toneladas, opcional)
- capacity: String (capacidade do equipamento, opcional)
- price_hour: Decimal (preço por hora, > 0)
- price_day: Decimal (preço por dia, > 0)
- price_hectare: Decimal (preço por hectare, >= 0)
- location: String (cidade + estado, obrigatório)
- latitude: Float (coordenada para busca geográfica)
- longitude: Float (coordenada para busca geográfica)
- operation_radius_km: Integer (raio de atuação, padrão 50 km)
- operator_type: Enum (owner, contractor)
- total_bookings: Integer (contador de reservas concluídas)
- rating: Float (média de avaliações, padrão 0)
- status: Enum (available, unavailable, archived)
- image_count: Integer (número de imagens)
- created_at: Timestamp
- updated_at: Timestamp
```

### Reserva/Aluguel (`bookings`)
```
- id: UUID (chave primária)
- machine_id: UUID (FK para machines)
- renter_id: UUID (FK para user_profiles)
- owner_id: UUID (FK para user_profiles)
- start_date: Date (data de início)
- end_date: Date (data de fim)
- start_time: Time (hora de início, opcional)
- end_time: Time (hora de fim, opcional)
- price_type: Enum (hourly, daily, hectare)
- total_price: Decimal (calculado automaticamente)
- status: Enum (pending, confirmed, in_progress, completed, cancelled)
- notes: String (notas adicionais)
- created_at: Timestamp
- updated_at: Timestamp
```

### Avaliação (`reviews`)
```
- id: UUID (chave primária)
- booking_id: UUID (FK para bookings, obrigatório)
- reviewer_id: UUID (FK para user_profiles, quem avalia)
- reviewed_user_id: UUID (FK para user_profiles, quem é avaliado)
- rating: Integer (1-5, obrigatório)
- comment: String (opcional, até 500 caracteres)
- machine_id: UUID (FK para machines, opcional)
- created_at: Timestamp
- updated_at: Timestamp
```

---

## ✍️ Regras de Cadastro

### Cadastro de Novo Usuário

**Fluxo Multi-Step Obrigatório:**

1. **Step 1 - Dados Básicos**
   - Email (validar formato, verificar se não existe)
   - Senha (mín. 8 caracteres, pelo menos 1 maiúscula, 1 número)
   - Nome completo (2+ palavras)
   - Telefone (formato validado)
   - CPF ou CNPJ (validação por dígito verificador)

2. **Step 2 - Localização**
   - Seleção de estado (obrigatório)
   - Seleção de cidade (obrigatório)
   - Rua/endereço (obrigatório)
   - Número (obrigatório)
   - Complemento (opcional)
   - CEP (validado)
   - Geolocalização (latitude/longitude capturadas)

3. **Step 3 - Sobre Você**
   - Tipo de usuário: Rentador, Proprietário ou Ambos
   - Descrição/bio (opcional, até 500 caracteres)
   - Áreas de operação (múltiplas cidades permitidas)

4. **Step 4 - Verificação de Email**
   - Envio de código OTP de 6 dígitos
   - Validade: 10 minutos
   - Máx. 3 tentativas erradas
   - Após 3 erros: aguardar 15 min ou solicitar novo código

**Validações Gerais:**
- Email único (case-insensitive)
- CPF/CNPJ válido (aplicar algoritmo de validação)
- Telefone formato brasileiro (+55 ou 11 dígitos)
- Apenas maiores de 18 anos (se aplicável)

---

## 🔍 Regras de Busca e Filtros

### Busca por Localização

**Parâmetros:**
```
- latitude: Float (obrigatório)
- longitude: Float (obrigatório)
- radius_km: Integer (padrão 50, mín 10, máx 100)
- category: String (opcional, filtro por categoria)
- price_min: Decimal (opcional)
- price_max: Decimal (opcional)
- year_min: Integer (opcional)
- rating_min: Float (opcional, 0-5)
- available_from: Date (opcional)
- available_to: Date (opcional)
- operation_type: String (colheita, plantio, pulverização, etc., opcional)
```

**Cálculo de Distância:**
- Usar fórmula Haversine para calcular distância em km
- Retornar apenas máquinas dentro do raio especificado
- Ordenar por distância (mais próximas primeiro) ou relevância

**Filtros Avançados:**
- **Categoria**: Trator, Colheitadeira, Pulverizador, Plantadeira, Implemento, Transporte
- **Operações**: Colheita, Plantio, Pulverização, Preparo de Solo, Transporte
- **Faixa de Preço**: Por hora, por dia ou por hectare
- **Potência**: Range de cavalos vapor (CV)
- **Ano de Fabricação**: Range (ex: 2015-2024)
- **Disponibilidade**: Data de início e fim
- **Avaliação Mínima**: 1-5 estrelas
- **Status**: Apenas máquinas com `status = 'available'`

**Regras de Listagem:**
- Máximo 50 resultados por página (paginar com limit/offset)
- Mostrar apenas máquinas com `status = 'available'`
- Ocultar máquinas de proprietários que o usuário bloqueou

---

## 🚜 Regras de Máquinas

### Adicionar Nova Máquina (Proprietário)

**Campos Obrigatórios:**
- Nome (descritivo, 10-100 caracteres)
- Marca (ex: "Case IH", "John Deere")
- Modelo (ex: "8590")
- Ano (>= 1990)
- Categoria (seleção única)
- Localização (estado + cidade)
- Preço (pelo menos 1: hora, dia ou hectare)

**Campos Opcionais:**
- Potência (CV)
- Peso (toneladas)
- Capacidade (descrição)
- Descrição detalhada (até 2000 caracteres)
- Tipo de operador (próprio ou contratado)
- Raio de atuação (padrão 50 km, 10-100 km)
- Múltiplas cidades de operação

**Upload de Imagens:**
- Máximo 10 imagens por máquina
- Formatos: JPG, PNG (sem WEBP)
- Tamanho máximo: 5 MB por imagem
- Resolução mínima: 800x600px
- 1ª imagem é a principal (thumbnail)
- Armazenar em Supabase Storage: `/machines/{machine_id}/{timestamp}.jpg`

**Validações:**
- Proprietário só pode adicionar máquinas de sua propriedade
- Máquina precisa de pelo menos 1 imagem para publicar
- Preços devem ser > 0

### Editar Máquina

**Permissões:**
- Apenas o proprietário pode editar sua máquina
- Admin pode editar para suporte/correção

**Campos Editáveis:**
- Todos, exceto `owner_id` e `created_at`
- Após edição: atualizar `updated_at`

### Deletar Máquina

**Regras:**
- Apenas proprietário pode deletar
- Não deletar de banco de dados (apenas arquivar com `status = 'archived'`)
- Máquinas com bookings ativas não podem ser deletadas

### Status da Máquina

- **`available`**: Pronta para aluguel
- **`unavailable`**: Alugada ou manutenção (proprietário escolhe datas)
- **`archived`**: Removida/descontinuada (não aparece em buscas)

---

## 📅 Regras de Reservas (Bookings)

### Criar Reserva

**Pré-requisitos:**
- Usuário autenticado
- Máquina com `status = 'available'`
- Datas não conflitantes com outras reservas
- Proprietário diferente do rentador

**Fluxo:**

1. **Rentador inicia booking**
   - Seleciona datas (start_date, end_date)
   - Seleciona tipo de preço (hourly, daily, hectare)
   - Adiciona notas opcionais
   - Sistema calcula `total_price` automaticamente

2. **Validações:**
   - `start_date` < `end_date`
   - Data não pode ser no passado
   - Máx. 365 dias de aluguel
   - Sem sobreposição de datas com outras reservas
   - Máquina deve estar disponível (status = 'available')

3. **Reserva Criada**
   - Status: `pending`
   - Email de notificação ao proprietário
   - Rentador e proprietário podem conversar via chat

### Estados da Reserva

```
┌──────────┐
│ PENDING  │  ← Criada, aguardando resposta
└────┬─────┘
     │ Proprietário aceita
     ↓
┌──────────────┐
│ CONFIRMED    │  ← Reserva confirmada
└────┬─────────┘
     │ Data de início chegou
     ↓
┌──────────────┐
│ IN_PROGRESS  │  ← Aluguel em andamento
└────┬─────────┘
     │ Data de fim chegou
     ↓
┌──────────────┐
│ COMPLETED    │  ← Aluguel concluído, pode avaliar
└────┬─────────┘
     │ Ambos avaliaram
     ↓
┌──────────────┐
│ REVIEWED     │  ← Aluguel finalizado com avaliações
└──────────────┘

Fluxo Alternativo:
PENDING → CANCELLED (proprietário recusa ou rentador cancela antes de aceitar)
CONFIRMED → CANCELLED (caso excepcional, requer justificativa)
```

**Regras por Estado:**

| Estado | Rentador | Proprietário | Admin |
|--------|----------|--------------|-------|
| pending | Ver, cancelar, alterar | Ver, aceitar, rejeitar | Ver tudo |
| confirmed | Ver, comunicar | Ver, comunicar | Ver tudo |
| in_progress | Ver, comunicar | Ver, comunicar | Ver tudo |
| completed | Ver, avaliar | Ver, avaliar | Ver tudo |

### Cancelamento de Reserva

- **Por Rentador (pending)**: Sem penalidade
- **Por Proprietário (pending)**: Proprietário pode rejeitar
- **Após Confirmado**: Requer justificativa, pode ter penalidade (futura implementação)
- **Durante Aluguel**: Bloqueado (exceto com suporte admin)

### Cálculo de Preço

```javascript
// Baseado em price_type da booking

// HOURLY (por hora)
let hours = (end_time - start_time) / 60
total = machine.price_hour * hours

// DAILY (por dia)
let days = (end_date - start_date) + 1 // inclusive
total = machine.price_day * days

// HECTARE (por hectare)
total = machine.price_hectare * hectares_informed
```

**Arredondamento**: 2 casas decimais (HALF_UP)

---

## 💰 Regras de Preços

### Preços de Máquina

- **price_hour**: Preço por hora de operação (decimal, > 0)
- **price_day**: Preço por dia de aluguel (decimal, > 0)
- **price_hectare**: Preço por hectare trabalhado (decimal, >= 0)

**Regra:** Proprietário define pelo menos 1 desses 3 preços

### Faixa de Preço para Busca

- **Min**: R$ 50 (piso mínimo)
- **Max**: R$ 10.000 (teto máximo)
- Validar durante filtro: `price_min < price_max`

### Histórico de Preços

- Não manter histórico (preço pode mudar a qualquer momento)
- Preço na booking é capturado no momento da criação (imutável)

---

## ⭐ Regras de Avaliações

### Criar Avaliação

**Pré-requisitos:**
- Booking em status `completed`
- Máx. 1 avaliação por user por booking
- Criada apenas após data de fim da reserva

**Campos:**
- Rating: 1-5 estrelas (obrigatório)
- Comentário: até 500 caracteres (opcional)
- Ao avaliar, usuário avalia o **proprietário**, não a máquina

**Regra Importante:**
- Rentador avalia proprietário/máquina
- Proprietário avalia rentador/atitude
- Reviews são **públicas** no perfil do usuário

### Editar Avaliação

- Usuário pode editar sua própria avaliação até 30 dias após criação
- Admin pode editar qualquer avaliação

### Deletar Avaliação

- Apenas criador ou admin
- Marcar como `deleted = true` (soft delete)

### Rating do Usuário

```
rating = SUM(all reviews rating) / COUNT(reviews)
```

- Mínimo: 1 estrela
- Máximo: 5 estrelas
- Exibir com 1 casa decimal (ex: 4.5)
- Atualizar em tempo real

### Filtro por Avaliação

Rentador pode filtrar máquinas por rating mínimo:
- 1 estrela
- 2 estrelas
- 3 estrelas
- 4 estrelas
- 5 estrelas

---

## 🔐 Regras de Segurança

### Row Level Security (RLS)

**Tabelas Protegidas:**

1. **user_profiles**
   - `SELECT`: Qualquer um (público)
   - `INSERT/UPDATE/DELETE`: Apenas o próprio usuário ou admin
   - Campos sensíveis mascarados: CPF/CNPJ, dados bancários

2. **machines**
   - `SELECT`: Qualquer um (públicas)
   - `INSERT`: Apenas proprietário autenticado
   - `UPDATE`: Apenas o próprio proprietário ou admin
   - `DELETE`: Apenas proprietário (soft delete → archived)

3. **bookings**
   - `SELECT`: Apenas rentador, proprietário ou admin
   - `INSERT`: Apenas rentador autenticado
   - `UPDATE`: Apenas rentador/proprietário (status, notas)
   - `DELETE`: Não permitido (soft delete → cancelled)

4. **reviews**
   - `SELECT`: Qualquer um (públicas)
   - `INSERT`: Apenas criador autenticado
   - `UPDATE`: Apenas criador ou admin
   - `DELETE`: Apenas criador ou admin

5. **addresses**
   - `SELECT/INSERT/UPDATE/DELETE`: Apenas o próprio usuário ou admin

6. **alerts**, **messages**
   - `SELECT/INSERT/UPDATE/DELETE`: Apenas o proprietário ou admin

7. **user_documents**
   - `SELECT`: Apenas proprietário ou admin
   - `INSERT`: Apenas proprietário autenticado
   - `UPDATE`: Apenas proprietário ou admin (para aprovação)

### Autenticação

- Usar Supabase Auth com JWT
- Session timeout: 7 dias
- Refresh token timeout: 30 dias
- Invalidar token ao logout

### Autorização

- Validar `role` antes de acessar rotas admin
- Validar `owner_id` antes de editar máquinas
- Validar `renter_id` ou `owner_id` antes de acessar bookings

### Validação de Dados

- Usar Zod para validação de schemas
- Validar CPF/CNPJ com dígito verificador
- Validar email com regex padrão
- Sanitizar input de texto (remover tags HTML)
- Validar coordenadas GPS (latitude -90 a 90, longitude -180 a 180)

---

## 💳 Regras de Pagamento

### Status de Transação

```
pending → processing → completed → refunded
              ↓
           failed
```

**Tipos de Transação:**
- Aluguel confirmado (debit, proprietário recebe)
- Reembolso/devolução (credit, rentador recebe)

### Webhook de Pagamento

- Endpoint: `/supabase/functions/webhook-handler`
- Validar assinatura antes de processar
- Atualizar status de booking → `in_progress` após pagamento confirmado
- Enviar notificação ao proprietário e rentador

### Comissão da Plataforma

- Definir percentual (ex: 15% da transação)
- Descontar automaticamente do valor recebido pelo proprietário
- Exemplo: Aluguel R$ 1.000 → Proprietário recebe R$ 850, Plataforma fica R$ 150

---

## 🛡️ Regras Administrativas

### Acesso ao Admin

- Requer `role = 'admin'` na tabela `user_roles`
- Rota protegida: `/admin`
- Rotas públicas: `/admin/login`, `/admin/forgot-password`

### Dashboard Admin

**Abas Disponíveis:**

1. **Platform Stats**
   - Total de usuários (todos, ativos últimos 30 dias)
   - Total de máquinas (ativas, arquivadas)
   - Total de reservas (pendentes, confirmadas, concluídas)
   - Receita total e últimos 30 dias
   - Taxa de conversão

2. **Users Tab**
   - Listar todos os usuários
   - Filtrar por: nome, email, status de verificação, rating
   - Ver detalhes: máquinas, reservas, documentos
   - Editar informações
   - Bloquear/desbloquear usuário

3. **Machines Tab**
   - Listar todas as máquinas
   - Filtrar por: categoria, status, proprietário, cidade
   - Ver imagens e detalhes
   - Editar/deletar (marcar como archived)
   - Verificar availability

4. **Analytics Tab**
   - Gráficos de crescimento (últimos 30 dias, 90 dias, 1 ano)
   - Distribuição por categoria
   - Distribuição por cidade/estado
   - Receita por período
   - Usuários ativos

5. **Document Approval Tab**
   - Listar documentos pendentes
   - Visualizar documento
   - Aprovar/rejeitar
   - Comentário (motivo da rejeição)
   - Marcar como `verified = true` após aprovação

### Relatórios

- Exportar dados em CSV/Excel (usuários, máquinas, bookings)
- Gerar relatórios por período

### Auditoria

- Log de ações admin (quem fez o quê, quando)
- Tabela: `admin_activity_log`

---

## 📱 Regras de Landing Pages

### Landing Pages Dinâmicas

**Por Cidade:** `/servicos/{state}/{city}`
- Mostrar máquinas disponíveis na cidade
- Destacar proprietários top-rated
- SEO otimizado com título/descrição

**Por Categoria/Operação:**
- `/servicos/colheita` - Colheitadeiras e serviços de colheita
- `/servicos/plantio` - Plantio
- `/servicos/pulverizacao` - Pulverizadores
- `/servicos/preparo-solo` - Preparo de solo
- `/servicos/transporte` - Transporte
- SEO otimizado com meta tags

---

## 📊 Métricas e Analytics

### Eventos Rastreados

| Evento | Descrição | Tabela |
|--------|-----------|--------|
| `search` | Usuário fez busca | analytics |
| `view_machine` | Usuário visitou detalhes | analytics |
| `create_booking` | Novo aluguel solicitado | analytics |
| `booking_confirmed` | Aluguel confirmado | analytics |
| `booking_completed` | Aluguel concluído | analytics |
| `add_favorite` | Máquina favoritada | analytics |
| `create_alert` | Alerta de busca criado | analytics |
| `send_message` | Mensagem enviada | analytics |
| `create_review` | Review criada | analytics |

### Cálculo de Stats

```sql
-- Total de usuários
SELECT COUNT(*) FROM user_profiles

-- Máquinas disponíveis
SELECT COUNT(*) FROM machines WHERE status = 'available'

-- Bookings pendentes
SELECT COUNT(*) FROM bookings WHERE status = 'pending'

-- Receita últimos 30 dias
SELECT SUM(total_price) FROM bookings
WHERE status = 'completed'
AND created_at >= NOW() - INTERVAL '30 days'
```

---

## 🔄 Integrações Externas

### Supabase

- **Database**: PostgreSQL
- **Auth**: JWT + Email
- **Storage**: Imagens de máquinas
- **Realtime**: Chat em tempo real (opcional)

### Email

- Envio de confirmação de cadastro
- Notificação de nova booking
- Aviso de aluguel próximo a iniciar/terminar
- Lembrete de avaliação

### Geolocalização

- Browser Geolocation API (capturar coordenadas do usuário)
- Cálculo de distância com Haversine formula
- Reverse geocoding (opcional) para endereço por coordenadas

---

## ✅ Checklist de Conformidade

- [ ] Todos os campos obrigatórios implementados
- [ ] Validações de entrada aplicadas
- [ ] RLS configurado corretamente
- [ ] Autenticação/Autorização funcionando
- [ ] Cálculo de preço correto
- [ ] Email de notificação enviando
- [ ] Analytics rastreando eventos
- [ ] Admin dashboard funcional
- [ ] Avaliações funcionando
- [ ] Chat entre usuários funcionando
- [ ] Upload de imagens funcionando
- [ ] Filtros de busca corretos
- [ ] SEO das landing pages otimizado
- [ ] Performance > 3s de carregamento

---

## 📝 Notas Importantes

1. **Múltiplas Cidades**: Um proprietário pode operar em várias cidades. A tabela `addresses` pode ter múltiplos registros por usuário.

2. **Preço Automático**: Quando rentador seleciona datas/hectares, calcular automaticamente o `total_price` antes de confirmar.

3. **Soft Delete**: Não deletar registros do banco. Usar campos `status = 'archived'` ou `deleted_at = NOW()`.

4. **Rating Real-time**: Atualizar rating do usuário em tempo real quando nova avaliação é criada.

5. **Bloquear Duplicação**: Impedir que mesmo rentador + máquina + período = múltiplas bookings simultâneas.

6. **Notificações**: Implementar sistema de notificações (email, SMS, push) para eventos importantes.

7. **Suporte**: Criar ticket de suporte para casos de disputa ou problema em aluguel.

---

**Documento criado em**: Fevereiro 2026
**Responsável**: Equipe Field Machine
**Próxima revisão**: Março 2026
