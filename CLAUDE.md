# CLAUDE.md — Field Machine

> Contexto de projeto para agentes de IA (Claude Code, Copilot, Cursor, etc.)

## Visão Geral

Field Machine é um marketplace P2P para serviços agrícolas (aluguel de máquinas, operadores, serviços de campo). O repositório é um **monorepo** com 3 subprojetos independentes.

## Estrutura do Monorepo

```
field-machine-rental/
├── app/          # Aplicação principal (Vite 5.4 + React 18.3 + TypeScript 5.8)
├── site/         # Landing page / site institucional (Next.js 16 + React 19 + TypeScript)
├── supabase/     # Migrations e configurações do Supabase
├── .github/      # GitHub Actions (CI: lint-test.yml, security.yml)
└── CLAUDE.md     # Este arquivo
```

## Stack Técnica

### app/ (SPA - Single Page Application)
- **Framework**: React 18.3 + Vite 5.4
- **Linguagem**: TypeScript 5.8
- **UI**: Tailwind CSS + shadcn/ui + Radix UI
- **Backend**: Supabase (Auth, Database, Storage, Realtime)
- **Roteamento**: React Router DOM
- **Estado**: React Query (TanStack Query)
- **Package Manager**: npm (package-lock.json em app/)

### site/ (Landing Page - SSG)
- **Framework**: Next.js 16.1 + React 19.2
- **Deploy**: Cloudflare Pages (static export via `output: 'export'`)
- **SEO**: sitemap.ts, robots.txt, llms.txt, Open Graph images
- **Domínio**: fieldmachine.com.br
- **Package Manager**: npm (package-lock.json em site/)

### supabase/
- Migrations SQL versionadas
- Row Level Security (RLS) ativo

## Comandos Essenciais

### app/
```bash
cd app
npm install
npm run dev          # Dev server (Vite)
npm run build        # Build produção
npm run lint         # ESLint
npm run type-check   # tsc --noEmit (se configurado)
```

### site/
```bash
cd site
npm install
npm run dev          # Dev server (Next.js)
npm run build        # Build estático (output: 'export')
npm run lint         # ESLint + Next.js lint
```

## CI/CD

- **CI**: GitHub Actions
  - `lint-test.yml`: Lint + Build em ambos subprojetos
  - `security.yml`: npm audit semanal + a cada push
- **Deploy**: Cloudflare Pages (auto-deploy)
  - `main` → produção
  - `develop`, `claude/**` → preview

### Observações importantes para CI
- **NÃO existe package-lock.json na raiz** (cada subprojeto tem o seu)
- Ao usar `cache: npm` no GitHub Actions, SEMPRE incluir:
  ```yaml
  cache-dependency-path: |
    app/package-lock.json
    site/package-lock.json
  ```

## Branches

- `main` — produção
- `develop` — staging/integração
- `claude/**` — branches geradas por agentes IA (preview automático na Cloudflare)

## Regras e Convenções

### Commits
- Usar Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`
- Mensagens em inglês
- Descrição clara do "porquê", não só do "o quê"

### Segurança
- NUNCA commitar arquivos `.env` (protegido pelo .gitignore root + app/.gitignore)
- Secrets do Supabase ficam em variáveis de ambiente (Cloudflare Pages / local .env)
- RLS ativo em todas as tabelas Supabase
- `npm audit` roda semanalmente via CI

### SEO (site/)
- Domínio canônico: `https://fieldmachine.com.br` (sem www)
- Sitemap gerado estaticamente em `site/app/sitemap.ts`
- Não incluir URLs do SPA (app/) no sitemap — são client-side e não crawláveis
- Open Graph images em `site/app/og/`

### Estilo de Código
- ESLint configurado em ambos subprojetos
- TypeScript strict mode
- Imports organizados
- Componentes em PascalCase, hooks com prefixo `use`

## Problemas Conhecidos / Dívida Técnica

1. **SEO**: URLs do SPA React no sitemap não são crawláveis pelo Google — precisam ser removidas ou substituídas por páginas SSG
2. **www vs non-www**: Falta redirect 301 na Cloudflare (www → non-www)
3. **Programmatic SEO**: Oportunidade de criar páginas estáticas por categoria de máquina para captura orgânica
4. **app/.gitignore**: Contém `package-lock.json` — avaliar se deve ser removido para consistência do CI

## Para Agentes de IA

- Sempre rode `npm install` dentro do subprojeto correto (app/ ou site/), nunca na raiz
- Teste builds localmente antes de commitar: `npm run build` em app/ e site/
- Ao criar workflows GitHub Actions, lembre do `cache-dependency-path` (monorepo sem root lock file)
- Branches de trabalho devem seguir o padrão `claude/nome-da-task` para gerar preview automaticamente
- Consulte este arquivo antes de fazer alterações estruturais
