# GitHub Setup - Field Machine

## Repositorio canonico

O repositorio canonico para desenvolvimento deve ser:

```text
https://github.com/lucasdierings/field-machine-rental
```

O remoto antigo/alternativo foi mantido localmente como `fieldmachine-org`:

```text
origin           https://github.com/lucasdierings/field-machine-rental.git
fieldmachine-org https://github.com/fieldmachinebrasil-gif/field-machine-rental.git
```

Use `origin` para PRs, CI, Dependabot e deploy Cloudflare. Use `fieldmachine-org` apenas se for necessario comparar ou sincronizar historico antigo.

## Branches

- `main`: producao e deploy Cloudflare.
- `dev`: integracao antes de producao, quando necessario.
- `codex/*`: trabalho feito pelo Codex.
- `claude/*`: branches existentes de automacao/assistentes.

Evite commits diretos em `main`. Use PR curto, com escopo claro.

## Branch protection recomendada

Configurar em GitHub -> Settings -> Branches -> Branch protection rules:

- Branch pattern: `main`
- Require a pull request before merging
- Require approvals: `1`
- Dismiss stale approvals when new commits are pushed
- Require status checks to pass before merging
- Required checks:
  - `lint-and-build`
  - `type-check`
- Require branches to be up to date before merging
- Require conversation resolution before merging
- Restrict force pushes
- Restrict deletions

Quando o lint do `app` for corrigido, remover o modo diagnostico no workflow e tornar `npm run lint` bloqueante para `app` tambem.

## GitHub Actions

Workflows ativos:

- `.github/workflows/lint-test.yml`: instala dependencias, roda lint/build/typecheck em `app` e `site`.
- `.github/workflows/security.yml`: executa `npm audit --audit-level=high` em `app` e `site` em modo diagnostico ate a fase de hardening de dependencias.

## Dependabot

`.github/dependabot.yml` monitora:

- npm em `/app`
- npm em `/site`
- GitHub Actions na raiz

Revisar PRs de dependencias semanalmente. Atualizacoes de seguranca devem ter prioridade sobre features.

## Secrets e variaveis

Nunca versionar `.env`, `.env.local`, `.env.production` ou service role keys.

Cloudflare Pages deve possuir:

Para `app.fieldmachine.com.br`:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Para `fieldmachine.com.br`:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Supabase Edge Functions devem receber secrets pelo painel/CLI do Supabase, nunca por arquivos versionados.

## Pendencias para configurar pela interface/API do GitHub

Estas acoes dependem de permissao administrativa no GitHub:

- Confirmar/renomear o repositorio, se quiser um nome mais explicito.
- Ativar branch protection em `main`.
- Ativar Dependabot security updates.
- Ativar secret scanning e push protection, se disponivel no plano.
- Confirmar que Cloudflare Pages aponta para `origin/main` do repositorio canonico.
