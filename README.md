# Field Machine Rental

**Plataforma de aluguel de máquinas agrícolas** — conecta produtores rurais (locatários) com proprietários de equipamentos (locadores) em um marketplace centralizado.

- 🌐 **App Web:** https://app.fieldmachine.com.br
- 📄 **Landing Page:** https://www.fieldmachine.com.br

---

## 📋 Visão Geral

Este é um **monorepo** contendo duas aplicações principales:

### `/app` - Aplicação Principal (Vite + React)
- Dashboard de máquinas disponíveis
- Sistema de reservas e bookings
- Gestão de perfil do usuário
- KYC (Know Your Customer) para verificação
- Panel de administrador

**Stack:** Vite 5.4 + React 18.3 + TypeScript 5.8 + Tailwind CSS 3.4 + shadcn/ui

### `/site` - Landing Page (Next.js)
- Página inicial com informações do serviço
- Formulários de contato
- SEO otimizado para marketing

**Stack:** Next.js 16.1 + React 19.2 + TypeScript 5.x + Tailwind CSS 4

### `/supabase` - Banco de Dados
- Migrações SQL versionadas
- Configurações do Supabase

---

## 🛠️ Tecnologias

### Frontend
- **Bundler:** [Vite](https://vitejs.dev/) 5.4 (super rápido)
- **Framework:** [React](https://react.dev/) 18.3
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) 5.8
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) 3.4 + Dark Mode
- **Componentes:** [shadcn/ui](https://ui.shadcn.com/) (82 componentes Radix UI)
- **Validação:** [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/)
- **Data Fetching:** [TanStack Query](https://tanstack.com/query/) (React Query)
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Ícones:** [Lucide React](https://lucide.dev/)

### Backend & Database
- **Auth:** [Supabase Auth](https://supabase.com/docs/guides/auth)
- **Database:** PostgreSQL (via Supabase)
- **Storage:** [Supabase Storage](https://supabase.com/docs/guides/storage)
- **Realtime:** [Supabase Realtime](https://supabase.com/docs/guides/realtime)

### DevOps
- **CI/CD:** GitHub Actions
- **Hosting:** [Cloudflare Pages](https://pages.cloudflare.com/)
- **Dependencies:** Dependabot (auto-updates)

---

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) **20.x** ou superior
- npm **10.x** ou superior
- Git com SSH configurado (recomendado)
- Conta [Supabase](https://supabase.com/) (desenvolvimento)

---

## 🚀 Configuração Local

### 1. Clone o repositório

```bash
git clone git@github.com:lucasdierings/field-machine-rental.git
cd field-machine-rental
```

### 2. Instale dependências

```bash
# Instalé dependências da aplicação principal
cd app && npm ci && cd ..

# Instale dependências do site
cd site && npm ci && cd ..
```

### 3. Configure as variáveis de ambiente

```bash
# Crie arquivo .env.local no app
cp app/.env.example app/.env.local

# Crie arquivo .env.local no site
cp site/.env.example site/.env.local

# Edite ambos com suas chaves Supabase
# (solicite acesso ao mantainer se necessário)
```

### 4. Inicie o servidor de desenvolvimento

**Em um terminal, inicie a aplicação principal:**
```bash
cd app
npm run dev
# Acesse http://localhost:8080
```

**Em outro terminal, inicie o site:**
```bash
cd site
npm run dev
# Acesse http://localhost:3000
```

---

## 📝 Variáveis de Ambiente

### App (Vite)
```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-anonima

# Configurações da aplicação
VITE_DEFAULT_SEARCH_RADIUS_KM=50
VITE_MIN_SEARCH_RADIUS_KM=10
VITE_MAX_SEARCH_RADIUS_KM=100
```

### Site (Next.js)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima

# Optional: Analytics
# NEXT_PUBLIC_GA_ID=seu-id-google-analytics
```

---

## 🔨 Scripts Disponíveis

### App (Vite + React)
```bash
cd app

npm run dev       # Servidor de desenvolvimento (porta 8080)
npm run build     # Build de produção (saída em /dist)
npm run build:dev # Build em modo development
npm run preview   # Preview do build gerado
npm run lint      # Executar ESLint
npm run test      # Rodar testes (quando implementado)
```

### Site (Next.js)
```bash
cd site

npm run dev       # Servidor de desenvolvimento (porta 3000)
npm run build     # Build de produção (saída em /out)
npm run start     # Servir build em produção
npm run lint      # Executar ESLint
npm run test      # Rodar testes (quando implementado)
```

---

## 🧪 Testes

Testes serão implementados gradualmente. Quando disponíveis:

```bash
cd app
npm run test              # Rodar testes Vitest
npm run test:coverage     # Rodar com cobertura
```

Prioridades de cobertura:
1. Autenticação (AuthContext)
2. Validação (CPF/CNPJ, emails)
3. Rotas protegidas
4. Hooks customizados

---

## 🚀 Deploy

### Cloudflare Pages

O projeto usa **Cloudflare Pages** com deploy automático:

- 🟢 **Desenvolvemento:** Push para branches `develop` e `claude/**`
- 🔴 **Produção:** Push para branch `main` (automático)

#### Configuração de Build

**Para App:**
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `app`

**Para Site:**
- Build command: `npm run build`
- Output directory: `out`
- Root directory: `site`

#### Variáveis de Ambiente

Adicione no painel Cloudflare Pages:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-anonima
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

---

## 🗄️ Banco de Dados

### Migrações

As migrações SQL ficam em `/supabase/migrations/` e são numeradas cronologicamente:

```
supabase/
└── migrations/
    ├── 20260217_add_service_completion_fields.sql
    └── 20260217_fix_user_documents_fk.sql
```

### Aplicar Migrações

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Abra **SQL Editor**
3. Execute os arquivos em ordem (mais antigos primeiro)

### Estrutura do Banco

- **Tabelas principais:** users, machines, bookings, reviews
- **Autenticação:** Supabase Auth
- **Storage:** Fotos de máquinas, documentos do usuário
- **RLS:** Row Level Security configurado por role

---

## 📚 Documentação

### Para Contribuidores
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Guia completo de desenvolvimento
- [Conventional Commits](https://www.conventionalcommits.org/) — Padrão de mensagens

### Histórico de Mudanças
- [CHANGELOG.md](./CHANGELOG.md) — Histórico de versões e features

### Acessibilidade
- [ACCESSIBILITY.md](./ACCESSIBILITY.md) — Padrões WCAG 2.1 (em progresso)

### Configuração de Produção
- [GUIA_CLOUDFLARE.md](./GUIA_CLOUDFLARE.md) — Setup do Cloudflare Pages
- [ANALISE_PRODUCAO.md](./ANALISE_PRODUCAO.md) — Análise e checklist pré-produção

---

## 👨‍💻 Desenvolvimento

### Workflow Git

1. Crie uma branch a partir de `develop`
2. Prefixe com tipo: `feature/`, `bugfix/`, `a11y/`, etc.
3. Abra um Pull Request
4. Aguarde aprovação e merge

```bash
# Exemplo
git checkout develop
git pull origin develop
git checkout -b feature/machine-search-filters
# ... faça suas mudanças
git push origin feature/machine-search-filters
# Crie PR no GitHub
```

### Padrões de Código

- **TypeScript:** Strict mode (sem `any`)
- **Formatting:** Prettier (automático)
- **Linting:** ESLint com @typescript-eslint
- **Components:** React functional components com TypeScript
- **Estilos:** Tailwind CSS + shadcn/ui
- **Acessibilidade:** WCAG 2.1 (aria-labels, roles semânticas)

---

## 📊 Status do Projeto

| Aspecto | Status | Score |
|---------|--------|-------|
| Arquitetura | ✅ Produção | 8/10 |
| Performance | ⚠️ Em progresso | 6.5/10 |
| Acessibilidade | 🔄 Em implementação | 4/10 |
| Testes | 🔄 Planejado | 0/10 |
| CI/CD | ✅ Implementado | 8/10 |
| Documentação | ✅ Básico | 6/10 |

---

## 🐛 Reportar Bugs

Use o template de [bug report](https://github.com/lucasdierings/field-machine-rental/issues/new?template=bug_report.md).

---

## 💡 Sugerir Features

Use o template de [feature request](https://github.com/lucasdierings/field-machine-rental/issues/new?template=feature_request.md).

---

## 📞 Contato

- **Mantainer:** Lucas Dierings
- **Email:** [solicitar ao mantainer]
- **Issues:** [GitHub Issues](https://github.com/lucasdierings/field-machine-rental/issues)

---

## 📄 Licença

[Adicionar informação de licença]

---

**Versão:** 0.1.0 | **Última atualização:** 2026-03-21
