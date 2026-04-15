# 🚀 Estratégia de Deployment: Arquitetura Monorepo com Dois Ambientes Independentes

## 📌 Visão Geral

Este documento descreve como manter o repositório monorepo com **dois ambientes de deployment completamente independentes**:

- **🌐 `/site`** → `fieldmachine.com.br` (Next.js Landing Page)
- **⚙️ `/app`** → `app.fieldmachine.com.br` (React Web Application)

**Objetivo Principal:** Mudanças no site NÃO afetam o app, e vice-versa.

---

## 🏗️ Arquitetura Atual

```
field-machine-rental/
├── .github/
│   ├── workflows/
│   │   ├── lint-test.yml          ← Roda para AMBOS app e site
│   │   └── security.yml           ← Roda para AMBOS
│   ├── dependabot.yml             ← Atualiza dependências
│   └── PULL_REQUEST_TEMPLATE.md
├── app/                           ← Aplicação React (Vite)
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── src/
│   └── dist/                      ← Build output
├── site/                          ← Landing Page (Next.js)
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── app/
│   └── out/                       ← Build output (SSG)
├── supabase/                      ← Configuração do banco
│   └── migrations/
├── README.md
├── CHANGELOG.md
├── VERSION
└── CONTRIBUTING.md
```

---

## 🌐 Configuração Cloudflare Pages

### **Projeto 1: field-machine-app**
- **URL:** https://app.fieldmachine.com.br
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Root Directory:** `app`
- **Environment:** Production

#### Variáveis de Ambiente (Production)
```env
VITE_SUPABASE_URL=<URL_DO_SEU_PROJETO_SUPABASE>
VITE_SUPABASE_PUBLISHABLE_KEY=<SUA_ANON_KEY>
```

---

### **Projeto 2: fieldmachine-site**
- **URL:** https://fieldmachine.com.br (e www.fieldmachine.com.br)
- **Build Command:** `npm run build`
- **Output Directory:** `out`
- **Root Directory:** `site`
- **Environment:** Production

#### Variáveis de Ambiente (Production)
```env
NEXT_PUBLIC_SUPABASE_URL=<URL_DO_SEU_PROJETO_SUPABASE>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUA_ANON_KEY>
```

---

## 🔄 Fluxo de Deployment

### **Quando você faz `git push origin main`:**

1. **GitHub Actions Workflow (`lint-test.yml`) é acionado**
   - Faz checkout do código
   - Instala dependências de AMBOS `app/` e `site/`
   - Roda lint em ambos
   - Roda build em ambos

2. **Se tudo passar (✅):**
   - **Cloudflare Pages - field-machine-app** detecta novo push
     - Faz build apenas o `/app`
     - Deploy para `app.fieldmachine.com.br`

   - **Cloudflare Pages - fieldmachine-site** detecta novo push
     - Faz build apenas o `/site`
     - Deploy para `fieldmachine.com.br`

3. **Resultado final:**
   - ✅ App atualizado em app.fieldmachine.com.br
   - ✅ Site atualizado em fieldmachine.com.br
   - ❌ Mudanças no site NÃO impactam o app e vice-versa

### **Se falhar a build (❌):**
- Nenhum deploy é feito
- Notificação de erro no GitHub Actions
- Você precisa corrigir o erro e fazer push novamente

---

## 📊 CI/CD Pipeline Detalhado

### **1. Lint and Build Workflow** (`lint-test.yml`)

```yaml
name: Lint and Build
on:
  push:
    branches: [main, develop, 'claude/**']
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    steps:
      # App
      - name: Install dependencies (app)
        working-directory: ./app
        run: npm ci

      - name: Run ESLint (app)
        working-directory: ./app
        run: npm run lint

      - name: Build app
        working-directory: ./app
        run: npm run build

      # Site
      - name: Install dependencies (site)
        working-directory: ./site
        run: npm ci

      - name: Run ESLint (site)
        working-directory: ./site
        run: npm run lint

      - name: Build site
        working-directory: ./site
        run: npm run build
```

**Quando roda:** A cada push em `main`, `develop`, ou branches `claude/**`

**O que faz:** Garante que AMBOS app e site compilam sem erros

---

### **2. Deploy Automático (Cloudflare Pages)**

Cada projeto Cloudflare detecta mudanças no GitHub automaticamente.

**Para App (`/app`):**
```
Push → GitHub → Webhook → Cloudflare Pages (field-machine-app)
                        ↓
                    Build `/app` apenas
                        ↓
                    Deploy para app.fieldmachine.com.br
```

**Para Site (`/site`):**
```
Push → GitHub → Webhook → Cloudflare Pages (fieldmachine-site)
                        ↓
                    Build `/site` apenas
                        ↓
                    Deploy para fieldmachine.com.br
```

---

## 🎯 Cenários de Uso

### **Cenário 1: Você quer mudar APENAS o Site**

```bash
# 1. Crie branch
git checkout -b feature/landing-page-redesign

# 2. Modifique apenas arquivos em /site
nano site/app/page.tsx
nano site/components/Header.tsx

# 3. Teste localmente
cd site && npm run dev

# 4. Commit
git add site/
git commit -m "feat: redesign landing page"

# 5. Push
git push origin feature/landing-page-redesign

# 6. Crie PR, review, merge para main

# Resultado:
# ✅ Site é atualizado em fieldmachine.com.br
# ✅ App permanece INALTERADO em app.fieldmachine.com.br
```

---

### **Cenário 2: Você quer mudar APENAS o App**

```bash
# 1. Crie branch
git checkout -b feature/booking-improvements

# 2. Modifique apenas arquivos em /app
nano app/src/pages/Booking.tsx
nano app/src/components/BookingForm.tsx

# 3. Teste localmente
cd app && npm run dev

# 4. Commit
git add app/
git commit -m "feat: improve booking flow UX"

# 5. Push
git push origin feature/booking-improvements

# 6. Crie PR, review, merge para main

# Resultado:
# ✅ App é atualizado em app.fieldmachine.com.br
# ✅ Site permanece INALTERADO em fieldmachine.com.br
```

---

### **Cenário 3: Você muda AMBOS (Supabase schema, por exemplo)**

```bash
# Caso: Adicionar novo campo na tabela machines

# 1. Crie branch
git checkout -b feature/machine-certifications

# 2. Modifique múltiplos diretórios:
# - supabase/migrations/xyz_add_certifications.sql (novo schema)
# - app/src/types/machine.ts (tipos TypeScript no app)
# - site/app/page.tsx (exibir certificações no site)

# 3. Teste
cd app && npm run dev
cd ../site && npm run dev

# 4. Commit
git add supabase/ app/ site/
git commit -m "feat: add machine certifications support"

# 5. Push e merge

# Resultado:
# ✅ Schema atualizado (migrations aplicadas manualmente no Supabase)
# ✅ App usa novos tipos no app.fieldmachine.com.br
# ✅ Site exibe certificações em fieldmachine.com.br
```

---

## 📋 Dependências: Quando Atualizar?

### **Dependências Compartilhadas**
- **Supabase client:** Ambos app e site precisam da mesma versão
  - Manter sincronizados em `package.json`

### **Dependências Específicas do App**
- Vite, React, TanStack Query, Framer Motion
- Atualizando no app NÃO afeta site

### **Dependências Específicas do Site**
- Next.js, Next.js específico packages
- Atualizando no site NÃO afeta app

### **Boas Práticas**
```bash
# Antes de atualizar, verifique se é compatível com ambos
npm outdated  # em app/
npm outdated  # em site/

# Atualize independentemente
cd app && npm install supabase@latest
cd ../site && npm install supabase@latest

# Teste ambos localmente
cd app && npm run build
cd ../site && npm run build
```

---

## 🔐 Variáveis de Ambiente

### **Estrutura**

```
Cloudflare Pages (field-machine-app)
└── Environment variables (Production)
    ├── VITE_SUPABASE_URL
    └── VITE_SUPABASE_PUBLISHABLE_KEY

Cloudflare Pages (fieldmachine-site)
└── Environment variables (Production)
    ├── NEXT_PUBLIC_SUPABASE_URL
    └── NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### **Sync Local**

```bash
# app/.env.local (para desenvolvimento) — não commitar!
VITE_SUPABASE_URL=<URL_DO_SEU_PROJETO_SUPABASE>
VITE_SUPABASE_PUBLISHABLE_KEY=<SUA_ANON_KEY>

# site/.env.local (para desenvolvimento) — não commitar!
NEXT_PUBLIC_SUPABASE_URL=<URL_DO_SEU_PROJETO_SUPABASE>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUA_ANON_KEY>
```

---

## 🐛 Troubleshooting

### **Problema: App falha no build, mas site continua funcionando**

**Causa:** Erro no `/app` não afeta `/site`

**Solução:**
```bash
# 1. Verifique logs do build
cd app && npm run build

# 2. Corrija o erro localmente
# ... fix code ...

# 3. Commit e push
git push origin main
```

---

### **Problema: Mudei o Site mas App também foi redeploy (indesejado)**

**Causa:** Você provavelmente também modificou arquivos do app

**Solução:**
```bash
# Verifique quais arquivos foram modificados
git status
git diff --name-only

# Se modificou app/ acidentalmente, desfaça
git checkout app/

# Revert e começa de novo
git reset --hard HEAD~1
```

---

### **Problema: Variáveis de ambiente não estão sendo aplicadas**

**Solução para App:**
1. Acesse: https://dash.cloudflare.com
2. Workers & Pages → **field-machine-app**
3. Settings → Environment variables
4. Verifique se selecionou **Production** (não Preview)
5. Clique em **Deployments** → 3 pontos do último deploy → **Retry deployment**

**Solução para Site:**
1. Acesse: https://dash.cloudflare.com
2. Workers & Pages → **fieldmachine-site**
3. Settings → Environment variables
4. Verifique se selecionou **Production**
5. Retry deployment

---

## 📊 Monitoramento

### **Como verificar status do deployment**

**GitHub Actions:**
```bash
# Ver status dos workflows
https://github.com/lucasdierings/field-machine-rental/actions
```

**Cloudflare Pages - App:**
```bash
# Ver deployments do app
https://dash.cloudflare.com → field-machine-app → Deployments
```

**Cloudflare Pages - Site:**
```bash
# Ver deployments do site
https://dash.cloudflare.com → fieldmachine-site → Deployments
```

---

## 🎓 Otimizações Futuras

### **1. Workflows Separados (Opcional)**
Se quiser otimizar ainda mais, você pode criar workflows separados:

```bash
# .github/workflows/lint-build-app.yml
# .github/workflows/lint-build-site.yml
```

Vantagens:
- Cada um roda independentemente
- Mais rápido se só muda um lado
- Melhor paralelização

---

### **2. Deployment Separado (Já implementado)**
✅ Cada projeto no Cloudflare é independente

---

### **3. Preview Deployments**
Quando você cria um PR:
- Cloudflare gera URLs de preview para ambos
- Exemplo: `main-abc123.field-machine-app.pages.dev`
- Você pode testar antes de fazer merge

**Para usar:**
1. Faça um PR (não push direto para main)
2. Espere Cloudflare criar preview deployments
3. Teste em: `branch-hash.field-machine-app.pages.dev`
4. Merge após validação

---

## 🔗 Links Úteis

- **GitHub Repo:** https://github.com/lucasdierings/field-machine-rental
- **GitHub Actions:** https://github.com/lucasdierings/field-machine-rental/actions
- **Cloudflare Dashboard:** https://dash.cloudflare.com
- **App Production:** https://app.fieldmachine.com.br
- **Site Production:** https://fieldmachine.com.br

---

## ✅ Checklist: Setup Completo

- [x] Repositório monorepo estruturado (`/app` e `/site`)
- [x] GitHub Actions workflows criados (`lint-test.yml`, `security.yml`)
- [x] Cloudflare Pages - field-machine-app configurado
- [x] Cloudflare Pages - fieldmachine-site configurado
- [x] Variáveis de ambiente sincronizadas em ambos
- [x] Build commands corretos em ambos
- [x] Root directories corretos (`app` e `site`)
- [x] Dependabot configurado para auto-updates
- [x] GitHub templates criados (PR, Issue)
- [ ] Monitoramento configurado (Sentry, Google Analytics)
- [ ] Preview deployments testados
- [ ] Performance budget definido

---

**Versão:** 1.0 | **Data:** 2026-03-21
