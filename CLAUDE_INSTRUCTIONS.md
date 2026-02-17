# 🤖 Instruções para Trabalhar com Claude Code

**Versão**: 1.0
**Data**: Fevereiro 2026
**Projeto**: Field Machine Rental

---

## 📑 Índice

1. [Como Iniciar uma Sessão](#como-iniciar-uma-sessão)
2. [Formato de Requisições](#formato-de-requisições)
3. [Branches e Git](#branches-e-git)
4. [Padrões de Código](#padrões-de-código)
5. [Testes](#testes)
6. [Commit Messages](#commit-messages)
7. [Checklist de Entrega](#checklist-de-entrega)

---

## 🚀 Como Iniciar uma Sessão

### Passo 1: Abrir Claude Code

```bash
# Via CLI (assumindo que está instalado)
claude code /home/user/field-machine-rental

# Ou acesse via web interface
# https://claude.ai/code
```

### Passo 2: Clonar/Sincronizar o Repositório

Ao iniciar, o Claude irá:
1. Verificar status do git
2. Buscar atualizações da branch principal
3. Checkout na branch de desenvolvimento

### Passo 3: Comunicar o Contexto

**Sempre forneça ao Claude:**

```
Olá! Vou trabalhar no projeto Field Machine Rental.

Contexto:
- Projeto: Platform de aluguel de máquinas agrícolas
- Tech Stack: React 18 + TypeScript + Supabase
- Branch: claude/business-rules-docs-QhnIZ (ou sua feature branch)

Tarefa: [Descrever claramente o que precisa ser feito]

Referências:
- Regras de negócio: BUSINESS_RULES.md
- Estrutura do projeto: veja /src
```

---

## 📋 Formato de Requisições

### Template: Bug Fix

```markdown
**Tipo**: Bug Fix

**Problema**:
Descrever o bug em detalhes (o que acontece, quando acontece, impacto)

**Passos para Reproduzir**:
1. Passo 1
2. Passo 2
3. Passo 3

**Comportamento Esperado**:
Descrever o que deveria acontecer

**Comportamento Atual**:
Descrever o que está acontecendo agora

**Arquivo(s) Afetado(s)**:
- src/pages/Search.tsx
- src/components/ui/machine-grid.tsx

**Prioridade**: Critical | High | Medium | Low

**Referências**:
- Regra de negócio: Seção X em BUSINESS_RULES.md
```

### Template: Nova Feature

```markdown
**Tipo**: Feature

**Descrição**:
Descrever a feature de forma clara e concisa

**Requisitos**:
- [ ] Requisito 1
- [ ] Requisito 2
- [ ] Requisito 3

**Regras de Negócio Aplicáveis**:
- Referência à seção em BUSINESS_RULES.md

**Arquivo(s) que Precisam Ser Criados/Modificados**:
- src/pages/NewFeature.tsx
- src/components/FeatureComponent.tsx
- src/hooks/useNewFeature.ts

**Critério de Aceitação**:
- [ ] Feature funciona conforme especificado
- [ ] Testes cobrem 80%+ do código novo
- [ ] Sem console errors ou warnings
- [ ] Validações aplicadas (forms, dados)

**Prioridade**: P0 | P1 | P2 | P3

**Referências**:
- Design: [Link ou descrição]
- Regras: Seção X em BUSINESS_RULES.md
```

### Template: Refactor/Melhoria

```markdown
**Tipo**: Refactor

**Objetivo**:
Descrever o que será melhorado e por quê

**Impacto**:
- Performance: X ms mais rápido
- Maintainability: Código mais legível
- Bundle size: Reduz X KB

**Arquivos Afetados**:
- src/lib/utils.ts
- src/hooks/useAuth.tsx

**Prioridade**: Medium | Low

**Testes**:
- Adicionar testes para: [listar]
```

---

## 🌿 Branches e Git

### Convenção de Branch

```
claude/feature-name-SESSION_ID
claude/bug-fix-SESSION_ID
claude/refactor-name-SESSION_ID
```

**Exemplo:**
```
claude/user-auth-2024-feb-abc123
claude/fix-booking-modal-2024-feb-abc123
```

### Fluxo de Git

**1. Verificar Status**
```bash
git status
git log --oneline -5
```

**2. Criar/Checkout Branch**
```bash
# Se branch não existe
git checkout -b claude/feature-name-SESSION_ID

# Se branch existe
git fetch origin claude/feature-name-SESSION_ID
git checkout claude/feature-name-SESSION_ID
```

**3. Fazer Alterações**
```bash
# Editar arquivos conforme necessário
# Testar localmente com: npm run dev
```

**4. Commit Estruturado**
```bash
# Staged files (específicos, não use "git add .")
git add src/pages/NewPage.tsx src/components/NewComponent.tsx

# Commit com mensagem descritiva (ver seção Commit Messages)
git commit -m "feat: implement user profile page with avatar upload"
```

**5. Push para Branch**
```bash
# Push com -u flag para rastrear remoto
git push -u origin claude/feature-name-SESSION_ID
```

**6. Pull Request (se aplicável)**
```bash
# Criar PR via GitHub interface ou CLI
gh pr create --title "Feature: User Profile Page" \
  --body "Implements user profile editing with avatar upload"
```

### Regras Importantes

- ✅ **Fazer**: Commits atômicos (1 funcionalidade por commit)
- ✅ **Fazer**: Mensagens de commit claras e descritivas
- ✅ **Fazer**: Testar antes de fazer commit
- ❌ **Não Fazer**: `git add .` (especificar arquivos)
- ❌ **Não Fazer**: `git push --force` (sem autorização)
- ❌ **Não Fazer**: Commitir `node_modules`, `.env`, passwords

---

## 💻 Padrões de Código

### React Components

**Padrão Funcional com TypeScript:**

```typescript
import { FC, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

interface Props {
  machineId: string
  onSelect?: (id: string) => void
}

export const MachineCard: FC<Props> = ({ machineId, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false)

  const { data: machine, isLoading, error } = useQuery({
    queryKey: ['machine', machineId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('machines')
        .select('*')
        .eq('id', machineId)
        .single()

      if (error) throw error
      return data
    }
  })

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error.message}</div>
  if (!machine) return null

  return (
    <div
      className="p-4 border rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="text-lg font-bold">{machine.name}</h2>
      {onSelect && (
        <button onClick={() => onSelect(machine.id)}>
          Selecionar
        </button>
      )}
    </div>
  )
}
```

**Padrão Custom Hook:**

```typescript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export const useMachine = (machineId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['machine', machineId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('machines')
        .select('*')
        .eq('id', machineId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!machineId // Só fazer query se machineId existe
  })

  return { machine: data, isLoading, error, refetch }
}
```

### Validação com Zod

```typescript
import { z } from 'zod'

export const bookingSchema = z.object({
  machineId: z.string().uuid('ID de máquina inválido'),
  startDate: z.date().refine(d => d > new Date(), 'Data passada'),
  endDate: z.date(),
  priceType: z.enum(['hourly', 'daily', 'hectare']),
  notes: z.string().max(500, 'Máximo 500 caracteres')
}).refine(
  data => data.startDate < data.endDate,
  { message: 'Data de fim deve ser após data de início', path: ['endDate'] }
)

type BookingForm = z.infer<typeof bookingSchema>
```

### Componente com React Hook Form

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export const BookingForm: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      priceType: 'daily'
    }
  })

  const onSubmit = async (data: BookingForm) => {
    try {
      // Fazer algo com data
      console.log('Form válido:', data)
    } catch (error) {
      console.error('Erro ao enviar:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('startDate')}
        type="date"
      />
      {errors.startDate && (
        <span className="text-red-500">{errors.startDate.message}</span>
      )}

      <button type="submit">Enviar</button>
    </form>
  )
}
```

### Naming Conventions

**Arquivos:**
- Componentes: `PascalCase.tsx` (ex: `MachineCard.tsx`)
- Páginas: `PascalCase.tsx` (ex: `Search.tsx`)
- Hooks: `use + PascalCase.ts` (ex: `useMachine.ts`)
- Tipos/Interfaces: `PascalCase.ts` (ex: `types.ts`)
- Utilitários: `kebab-case.ts` (ex: `format-currency.ts`)

**Variáveis/Funções:**
- Variáveis: `camelCase` (ex: `isLoading`, `machineId`)
- Constantes: `SCREAMING_SNAKE_CASE` (ex: `MAX_RADIUS_KM`)
- Funções: `camelCase` (ex: `calculateDistance()`)

**Classes CSS:**
- Use Tailwind classes
- Ordem recomendada: layout → sizing → spacing → typography → colors

---

## ✅ Testes

### Estrutura

```
src/
├── __tests__/
│   ├── hooks/
│   │   └── useMachine.test.ts
│   ├── components/
│   │   └── MachineCard.test.tsx
│   └── lib/
│       └── utils.test.ts
```

### Exemplo de Teste

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { useMachine } from '@/hooks/useMachine'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)

describe('useMachine', () => {
  it('should fetch machine data', async () => {
    const { result } = renderHook(() => useMachine('machine-123'), { wrapper })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.machine).toEqual(
      expect.objectContaining({
        id: 'machine-123',
        name: expect.any(String)
      })
    )
  })

  it('should handle error', async () => {
    const { result } = renderHook(() => useMachine('invalid-id'), { wrapper })

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
    })
  })
})
```

### Rodar Testes

```bash
# Todos os testes
npm test

# Com coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Arquivo específico
npm test -- src/__tests__/hooks/useMachine.test.ts
```

---

## 📝 Commit Messages

### Formato

```
<tipo>(<escopo>): <descrição>

<corpo (opcional)>

<footer (opcional)>
```

### Tipos

- `feat`: Nova feature
- `fix`: Corrigir bug
- `docs`: Documentação
- `style`: Formatação (sem lógica)
- `refactor`: Refatoração de código
- `perf`: Melhorias de performance
- `test`: Adicionar/modificar testes
- `chore`: Dependências, build, etc.

### Exemplos

**Feature:**
```
feat(booking): implement booking confirmation workflow

- Create BookingConfirm component
- Add email notification to owner
- Update booking status in database
- Add unit tests for confirmation logic
```

**Bug Fix:**
```
fix(search): correct geolocation distance calculation

Using Haversine formula instead of simple distance.
Fixes issue where machines 50km away weren't showing.

Fixes #123
```

**Refactor:**
```
refactor(hooks): extract machine query logic to custom hook

Creates useMachineDetails hook to reduce code duplication
in MachineDetails and MachineCard components.
```

**Regra Importante:**
- Commit deve ser atômico (1 funcionalidade = 1 commit)
- Mensagem deve explicar **POR QUÊ**, não **O QUÊ**
- Máximo 50 caracteres na primeira linha
- Usar imperativo ("adicionar", não "adicionado")

---

## ✨ Checklist de Entrega

Antes de marcar uma tarefa como concluída:

### Código

- [ ] Código está escrito seguindo padrões do projeto
- [ ] Sem console.log, console.error ou statements de debug
- [ ] Sem commented code
- [ ] TypeScript stricto sem `any`
- [ ] Validações aplicadas (forms, dados, entradas)
- [ ] Sem duplicação de código

### Testes

- [ ] Testes escritos (mínimo 80% coverage)
- [ ] Todos os testes passando
- [ ] Testes cobrem happy path + error cases
- [ ] Rodar `npm test` com sucesso

### Funcionalidade

- [ ] Feature funciona conforme especificado
- [ ] Testado em navegador (Chrome, Firefox)
- [ ] Responsivo em mobile
- [ ] Sem memory leaks (React Query cleanup)
- [ ] Performance aceitável (< 3s load time)

### Segurança

- [ ] RLS validado (se banco de dados)
- [ ] Sem exposição de dados sensíveis
- [ ] Sem SQL injection ou XSS
- [ ] Validação de entrada adequada

### Git

- [ ] Commits são atômicos e com boas mensagens
- [ ] Branch está atualizada com `main`
- [ ] Sem conflitos de merge
- [ ] Pronto para PR/merge

### Documentação

- [ ] Arquivo alterado está documentado em README/BUSINESS_RULES.md
- [ ] Componentes complexos têm comentários
- [ ] API integrada? Documentar em /docs

---

## 🔍 Exemplos de Conversas

### Exemplo 1: Reportar Bug

```
Olá! Encontrei um bug na busca de máquinas.

**Problema**: Quando filtro por raio 100km, aparecem máquinas muito longe (200km+)

**Como reproduzir**:
1. Ir para Search.tsx
2. Ativar busca por localização
3. Filtrar raio de 100km
4. Resultados mostram máquinas além do raio

**Esperado**: Apenas máquinas dentro de 100km aparecem

**Referência**: BUSINESS_RULES.md seção "Busca por Localização"

Arquivo afetado: src/lib/geolocation.ts (linha 45)
```

### Exemplo 2: Solicitar Feature

```
Preciso implementar um novo recurso: Alertas de Busca

**Descrição**: Usuários podem criar alertas com critérios (categoria, raio, preço)
e recebem notificação quando novas máquinas match os critérios.

**Requisitos**:
- [ ] Página de criação de alertas
- [ ] Listar alertas do usuário
- [ ] Editar/deletar alertas
- [ ] Sistema de notificação (email)
- [ ] Testes unitários

**Referência**: BUSINESS_RULES.md seção "Alertas de Busca"

**Prioridade**: P1 (alta)
```

### Exemplo 3: Pedir Review de PR

```
Criei uma PR com as seguintes mudanças:

**Título**: Implement machine image gallery

**O que foi feito**:
- Cria component MachineGallery.tsx
- Suporta navegação com arrows/dots
- Upload de múltiplas imagens
- Validação de tamanho/formato

**Como testar**:
1. npm run dev
2. Ir para /add-machine
3. Fazer upload de 3+ imagens
4. Clicar em navegar galeria

**Commit**: a3f7b2c

Pronto para merge?
```

---

## 📞 Shortcuts & Quick Commands

```bash
# Desenvolvimento
npm run dev              # Iniciar servidor local
npm run build           # Build para produção
npm test                # Rodar testes
npm run lint            # Verificar código

# Git
git status              # Ver mudanças
git log --oneline -10   # Ver últimos 10 commits
git diff                # Ver mudanças específicas
git stash               # Guardar mudanças temp

# Supabase (se local)
supabase start          # Iniciar Supabase local
supabase stop           # Parar Supabase
```

---

## 🎯 Best Practices

1. **Sempre ler a regra de negócio antes de implementar**
2. **Testar no navegador, não só no código**
3. **Cometer com frequência, em pequenos chunks**
4. **Comunicar-se claramente em cada requisição**
5. **Documentar alterações de API/Database**
6. **Fazer PR review antes de mergear em main**
7. **Manter branches limpas (deletar após merge)**
8. **Usar branches nomeadas claramente**

---

**Documento criado em**: Fevereiro 2026
**Próxima atualização**: Conforme necessário
