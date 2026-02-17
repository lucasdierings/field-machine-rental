# 🏢 Organização do Projeto - Field Machine Rental

**Versão**: 1.0
**Data**: Fevereiro 2026

---

## 📋 Quick Start para Desenvolvedores

### 1️⃣ Antes de Iniciar

Leia (nesta ordem):
1. **Este arquivo** (visão geral)
2. **BUSINESS_RULES.md** (regras de negócio)
3. **CLAUDE_INSTRUCTIONS.md** (como trabalhar com Claude)
4. **README.md** (setup técnico)

### 2️⃣ Setup Inicial

```bash
# Clone o repositório
git clone https://github.com/lucasdierings/field-machine-rental.git
cd field-machine-rental

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local

# Inicie servidor de desenvolvimento
npm run dev
```

### 3️⃣ Estrutura de Pastas Importantes

```
src/
├── pages/              ← Páginas/Rotas principais
├── components/         ← Componentes React reutilizáveis
├── hooks/              ← Custom React hooks
├── lib/                ← Funções utilitárias, validações
├── integrations/       ← Integração com Supabase
└── assets/             ← Imagens estáticas
```

---

## 👥 Papéis no Time

### Product Owner / Gerenciador
**Responsabilidades:**
- Priorizar features a desenvolver
- Criar issues/requisições claras
- Revisar PRs
- Validar features completas

**Como trabalhar com Claude:**
```
Olá Claude! Preciso que você implemente a feature X.

Contexto:
- Tipo: Bug Fix / Feature / Refactor
- Prioridade: P0 / P1 / P2
- Regra de negócio: [Seção em BUSINESS_RULES.md]

Requisitos:
- [ ] Requisito 1
- [ ] Requisito 2

Critério de Aceitação:
- [ ] Feature funciona
- [ ] Testes passam
- [ ] Pronto para merge
```

### Developer (Front-end/Back-end)
**Responsabilidades:**
- Implementar features conforme requisitos
- Escrever testes
- Fazer commits atômicos
- Manter código limpo

**Como trabalhar com Claude:**
```
@claude help me implement [feature name]

Current context:
- Arquivo principal: src/pages/Search.tsx
- Relacionado a: BUSINESS_RULES.md → Seção de Busca
- Status: [Em progresso/Bloqueado/Pronto]

Preciso que você:
1. [Tarefa 1]
2. [Tarefa 2]
3. Rodas testes antes de fazer commit
```

### QA / Tester
**Responsabilidades:**
- Testar features antes de merge
- Reportar bugs claros
- Validar regras de negócio
- Documentar issues

**Template para reportar bug:**
```
## Bug: [Título Claro]

**Passos para reproduzir:**
1. ...
2. ...

**Esperado:** [O que deveria acontecer]
**Atual:** [O que está acontecendo]

**Arquivo afetado:** src/components/X.tsx

**Referência:** BUSINESS_RULES.md → [Seção]
```

---

## 📊 Features/Tarefas em Progresso

Use este template para rastrear o que está sendo feito:

```markdown
# Feature: [Nome]

**Status**: [ ] Planejamento | [x] Em Progresso | [ ] Review | [ ] Concluído

**Responsável**: @nome

**Branch**: claude/feature-name-SESSION_ID

**Arquivos Afetados**:
- [ ] src/pages/X.tsx
- [ ] src/components/Y.tsx
- [ ] src/hooks/useZ.ts

**Progresso**:
- [ ] Análise completa
- [ ] Componentes criados
- [ ] Testes escritos
- [ ] Pronto para merge

**Bloqueadores** (se houver):
- Aguardando decisão de X
- Problema com Y

**Próximas Ações**:
1. Implementar componente Z
2. Testar integração
```

---

## 🎯 Tipos de Tarefas e Fluxo

### Tipo 1: Bug Fix (Correção de Bug)

**Fluxo:**
```
1. Developer abre issue com bug
2. Análise da causa raiz
3. Implementar fix
4. Escrever teste (regression test)
5. Commit com mensagem: fix(scope): description
6. PR review
7. Merge para main
```

**Template:**
```markdown
**Bug**: [Título claro]
**Prioridade**: P0 | P1 | P2
**Status**: Aberto

**Problema**:
Descrição clara do bug

**Impacto**:
Quantos usuários afetados? Qual é o impacto?

**Arquivo(s)**:
- src/pages/X.tsx:45

**Regra de Negócio**:
Referência em BUSINESS_RULES.md
```

### Tipo 2: Feature Nova

**Fluxo:**
```
1. PM descreve feature
2. Tech lead estima complexidade
3. Developer implementa:
   - UI/Components
   - Lógica
   - Validações
   - Testes
   - Documentação
4. PR review
5. QA valida
6. Merge para main
```

**Template:**
```markdown
**Feature**: [Nome]
**Prioridade**: P0 | P1 | P2
**Estimativa**: [T-shirt: XS | S | M | L | XL]

**Descrição**:
O que o usuário conseguirá fazer?

**Regras de Negócio**:
- BUSINESS_RULES.md → [Seção]

**Requisitos Técnicos**:
- [ ] Backend: [Se aplicável]
- [ ] Frontend: [Componentes a criar]
- [ ] Database: [Mudanças necessárias]
- [ ] Testes: [Cobertura mínima 80%]

**Critério de Aceitação**:
- [ ] Feature funciona conforme especificado
- [ ] Testado em mobile e desktop
- [ ] Zero console errors
- [ ] Testes passam (80%+ coverage)
```

### Tipo 3: Refactor/Melhoria Técnica

**Fluxo:**
```
1. Developer identifica código que pode melhorar
2. Planejar mudanças
3. Implementar refactor
4. Rodar testes (devem passar 100%)
5. Medir improvement (performance, bundle size, etc.)
6. Commit com mensagem: refactor(scope): description
7. PR review
8. Merge para main
```

**Template:**
```markdown
**Refactor**: [Tema]
**Justificativa**: Por quê isso precisa melhorar?

**Benefícios**:
- Performance: X ms mais rápido
- Bundle: Reduz Y KB
- Maintainability: Código mais legível

**Mudanças**:
- [ ] Arquivo A
- [ ] Arquivo B

**Testes**:
Todos os testes devem passar. Nenhum breaking change.
```

---

## 📈 Processo de Review e Merge

### Checklist para PR Review

```markdown
## Code Review Checklist

### Qualidade do Código
- [ ] Código segue padrões do projeto
- [ ] Sem console.log ou statements de debug
- [ ] Sem commented code
- [ ] TypeScript sem `any`
- [ ] Nomes claros (variáveis, funções)
- [ ] Sem duplicação

### Testes
- [ ] Testes escritos
- [ ] Testes cobrem happy path + errors
- [ ] Coverage >= 80%
- [ ] Todos os testes passam

### Funcionalidade
- [ ] Implementa conforme requisito
- [ ] Testado em browser
- [ ] Responsivo em mobile
- [ ] Sem console errors
- [ ] Performance OK (< 3s)

### Segurança
- [ ] RLS validado
- [ ] Sem exposição de dados
- [ ] Validação de entrada
- [ ] Sem SQL injection/XSS

### Documentação
- [ ] Commit messages claras
- [ ] Documentação atualizada
- [ ] APIs documentadas

### Aprovação Final
- [ ] Pronto para merge
- [ ] Comentários resolvidos
- [ ] Não há bloqueadores
```

### Como Mergear uma PR

```bash
# 1. Sync com main (se houver conflitos, resolver)
git fetch origin main
git merge origin/main

# 2. Rodar testes finais
npm test
npm run build

# 3. Se OK, fazer merge
git checkout main
git merge claude/feature-name-SESSION_ID
git push origin main

# 4. Deletar branch
git branch -d claude/feature-name-SESSION_ID
git push origin --delete claude/feature-name-SESSION_ID
```

---

## 🗂️ Documentação do Projeto

### Arquivos Importantes

| Arquivo | Propósito |
|---------|-----------|
| `BUSINESS_RULES.md` | Regras de negócio (LEIA SEMPRE) |
| `CLAUDE_INSTRUCTIONS.md` | Como trabalhar com Claude |
| `PROJECT_ORGANIZATION.md` | Este arquivo (visão geral) |
| `README.md` | Setup técnico e dependências |
| `.env.example` | Variáveis de ambiente |
| `package.json` | Dependências npm |

### Como Documentar Mudanças

**Se mudou database:**
```markdown
## Database Changes

### Tabela: bookings (modificada)
- Novo campo: `notes` (String, opcional)
- Alterado campo: `status` (enum expandido)

### Migration SQL:
```sql
ALTER TABLE bookings ADD COLUMN notes TEXT;
ALTER TYPE booking_status ADD VALUE 'archived';
```
```

**Se criou novo componente:**
```markdown
## Novo Componente: BookingForm

**Localização**: src/components/booking/BookingForm.tsx

**Props**:
- `onSubmit: (data: BookingFormData) => Promise<void>`
- `initialValues?: BookingFormData`
- `isLoading?: boolean`

**Uso**:
```tsx
<BookingForm
  onSubmit={handleSubmit}
  initialValues={booking}
/>
```
```

---

## 🧪 Testing & Quality

### Coverage Mínimo por Tipo de Arquivo

| Tipo | Cobertura Esperada |
|------|-------------------|
| Components | 80%+ |
| Hooks | 90%+ |
| Utils/Lib | 95%+ |
| Pages | 60%+ (UI complexa) |

### Rodar Testes

```bash
# Todos os testes
npm test

# Com coverage report
npm test -- --coverage

# Watch mode
npm test -- --watch

# Arquivo específico
npm test -- src/hooks/useMachine.test.ts

# Debug
npm test -- --debug
```

### CI/CD Pipeline

**Quando faz push para PR/main:**
1. ✅ ESLint (lint verificação)
2. ✅ TypeScript (type check)
3. ✅ Testes unitários
4. ✅ Build (deve suceder)
5. ✅ Deploy preview (Cloudflare Pages)

---

## 🚀 Deployment

### Branches e Ambientes

| Branch | Ambiente | Deploy |
|--------|----------|--------|
| `main` | Produção | Automático (Cloudflare) |
| `develop` | Staging | Manual (se houver) |
| `claude/*` | Development | Nenhum (local) |

### Deploy Manual

```bash
# 1. Atualizar dependencies (se necessário)
npm install

# 2. Build
npm run build

# 3. Deploy (Cloudflare)
npm run deploy

# Ou manualmente:
# Push para main
git push origin main
# Cloudflare vai fazer deploy automaticamente
```

---

## 📞 Contato & Suporte

### Escalação de Problemas

**Bug em Produção?**
1. Criar issue com label `urgent`
2. Notificar via chat/email
3. PR hotfix para `main`
4. Deploy imediato

**Bloqueador de Feature?**
1. Documentar em issue
2. Conversar com tech lead
3. Ajustar scope se necessário
4. Continuar em paralelo

**Dúvida sobre Regra de Negócio?**
1. Consultar BUSINESS_RULES.md
2. Se não encontrar, perguntar ao PM
3. Documentar resposta em BUSINESS_RULES.md

---

## 📅 Ciclo de Desenvolvimento

### Sprint Padrão (2 semanas)

**Segunda-feira (Planning)**
- PM prioriza features
- Tech lead estima
- Developer pega tarefas

**Terça - Quinta (Development)**
- Implementar features
- PR reviews
- QA testing

**Sexta (Release)**
- Últimas correções
- Deploy para produção
- Retrospectiva

---

## 🎓 Learning Resources

**Para entender o projeto:**
1. Ler `BUSINESS_RULES.md` (regras)
2. Ler `CLAUDE_INSTRUCTIONS.md` (padrões)
3. Explorar `/src` estrutura
4. Rodar `npm run dev` e testar
5. Ler alguns componentes existentes

**Para features específicas:**
- Busca: Seção "Regras de Busca e Filtros" em BUSINESS_RULES.md
- Booking: Seção "Regras de Reservas" em BUSINESS_RULES.md
- Auth: Seção "Regras de Segurança" em BUSINESS_RULES.md
- Admin: Seção "Regras Administrativas" em BUSINESS_RULES.md

---

## ✅ Antes de Commitir (Checklist Final)

```
Código:
- [ ] ESLint passa (npm run lint)
- [ ] TypeScript valida (npm run build)
- [ ] Sem console.log/debug statements
- [ ] Código legível e bem nomeado

Testes:
- [ ] Testes passam (npm test)
- [ ] Coverage >= mínimo esperado
- [ ] Testes cobrem novos scenarios

Funcionalidade:
- [ ] Feature funciona localmente
- [ ] Testado no navegador (Chrome, Firefox)
- [ ] Responsivo (mobile/desktop)
- [ ] Performance OK

Documentação:
- [ ] Commit message clara
- [ ] Documentação atualizada (se necessário)
- [ ] Regras de negócio validadas

Git:
- [ ] Branch atualizada com main
- [ ] Commits são atômicos
- [ ] Sem merge conflicts
```

---

**Documento criado em**: Fevereiro 2026
**Responsável**: Equipe Field Machine
**Próxima revisão**: Conforme mudanças no projeto
