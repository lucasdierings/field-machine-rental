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
npm run typecheck    # tsc --noEmit
npm run test         # Vitest (37 testes unitários)
npm run test:watch   # Vitest em modo watch
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
- `dev` — staging/integração (base de todo trabalho)
- `claude/**` — branches geradas por agentes IA (preview automático na Cloudflare)

> **PR aberto**: [#29 dev → main](https://github.com/lucasdierings/field-machine-rental/pull/29) — consolidação de 7 branches (bugfixes, segurança, SEO, testes, páginas). CI ✅. Aguardando revisão e configuração dos secrets do Supabase antes de mergear.

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

1. ~~**SEO**: URLs do SPA React no sitemap~~ — ✅ resolvido (PR #29: sitemap limpo)
2. ~~**www vs non-www**: Falta redirect 301~~ — ✅ resolvido (PR #29: `site/public/_redirects`)
3. **Programmatic SEO**: Oportunidade de criar páginas estáticas por categoria de máquina para captura orgânica
4. **app/.gitignore**: Contém `package-lock.json` — avaliar se deve ser removido para consistência do CI
5. **app/ lint**: ~276 erros pré-existentes de `no-explicit-any` e `no-unused-vars` (CI usa `continue-on-error: true` para lint, não bloqueia deploy)
6. **supabase-migrate.yml**: workflow de auto-apply de migrations aguardando 3 secrets no GitHub (Settings → Environments → production): `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_ID`, `SUPABASE_DB_PASSWORD`

## Armadilhas Comuns (evitar regressões)

### app/ — ESLint flat config
- O `app/eslint.config.js` usa **flat config** com `typescript-eslint` (não `@typescript-eslint/eslint-plugin`)
- Regras como `explicit-function-return-types` **não existem** neste setup — só existem no plugin clássico
- Antes de adicionar regras TS, verificar se existem em `tseslint.configs.recommended`

### site/ — Static export (`output: 'export'`)
- O site usa `output: 'export'` no `next.config.ts` → gera HTML estático, sem servidor Node
- **Route handlers** (como `app/og/route.tsx`) devem usar `export const dynamic = 'force-static'` — NUNCA `runtime = 'nodejs'`
- **Arquivos com JSX** devem ter extensão `.tsx`, não `.ts`
- **OG images** (Satori/`next/og`):
  - Todo `<div>` com mais de um filho precisa de `display: 'flex'` explícito
  - Evitar caracteres especiais (✓, →, etc.) que dependem de fontes externas — usar ASCII (`-`, `*`)
  - `<br />` não funciona bem; usar flex column com divs separados

### site/ — Next.js Link
- Usar `<Link>` de `next/link` para navegação interna, nunca `<a href="/">`
- `<a>` é aceitável apenas para links externos ou âncoras (`#section`)

## Para Agentes de IA

- Sempre rode `npm install` dentro do subprojeto correto (app/ ou site/), nunca na raiz
- **OBRIGATÓRIO**: Teste builds localmente antes de commitar: `npm run build` em app/ e site/
- **OBRIGATÓRIO**: Rode `npx tsc --noEmit` em ambos subprojetos (CI roda type-check separado)
- Ao criar workflows GitHub Actions, lembre do `cache-dependency-path` (monorepo sem root lock file)
- Branches de trabalho devem seguir o padrão `claude/nome-da-task` para gerar preview automaticamente
- Consulte este arquivo antes de fazer alterações estruturais


## Planned Features (Backlog)

- **WhatsApp verification via Meta Cloud API** — Substituir/complementar email com verificação por WhatsApp. Meta Cloud API oferece 1.000 msgs/mês grátis. Taxa de abertura 98% vs 20% do email. Ideal para agricultor brasileiro. Implementar como opção ao lado do email na verificação do onboarding. Provedor: Meta Cloud API (oficial). Docs: developers.facebook.com/docs/whatsapp/cloud-api

## Workflow de Branches (GitFlow Simplificado)

```
main ──────────────────── (produção — só recebe PR de dev)
        ↑            ↑
dev ──────────────────── (staging/integração — base de todo trabalho)
     ↑      ↑      ↑
  feat-1  feat-2  feat-3
```

**Regras:**
1. Toda nova sessão começa com: `git fetch && git checkout dev && git pull origin dev`
2. Criar branch sempre a partir de `dev`: `git checkout -b claude/nome-da-task`
3. PR sempre vai para `dev` (não para `main`)
4. Após merge no `dev`, se estável → PR de `dev` para `main`
5. Após qualquer merge em `main` → imediatamente `git merge origin/main` no `dev`

**Nunca:**
- Criar branch a partir de `main` sem sincronizar `dev` primeiro
- Fazer push direto em `main`
- Deixar `dev` desatualizado em relação a `main` por mais de 1 sessão
