# Configuração Supabase + GitHub Actions

Este guia explica como configurar os secrets do GitHub para que as migrations
do Supabase sejam aplicadas automaticamente em cada push para `main`, e como
rotacionar a anon key caso ela tenha sido exposta.

O workflow fica em `.github/workflows/supabase-migrate.yml` e roda:

- Automaticamente quando arquivos em `app/supabase/migrations/**` mudam em `main`
- Manualmente via GitHub Actions → **Run workflow** (útil para aplicar migrations
  que já foram mergeadas antes deste workflow existir)

---

## Parte 1 — Configurar os secrets no GitHub

O workflow precisa de 3 secrets:

| Secret | Onde pegar |
|---|---|
| `SUPABASE_ACCESS_TOKEN` | [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) → **Generate new token** (escopo: all projects) |
| `SUPABASE_PROJECT_ID` | Supabase Dashboard → **Project Settings → General → Reference ID** (uma string tipo `uynscjoomsiryqnyeohm`) |
| `SUPABASE_DB_PASSWORD` | Supabase Dashboard → **Project Settings → Database → Database password**. Se não lembra, clique em **Reset database password** e salve a nova senha num lugar seguro. |

### Passo a passo

1. Acesse https://github.com/lucasdierings/field-machine-rental/settings/secrets/actions
2. Clique em **New repository secret**
3. Para cada um dos 3 nomes acima:
   - Name: o nome exato (ex: `SUPABASE_ACCESS_TOKEN`)
   - Secret: cole o valor que você copiou do Supabase
   - **Add secret**

Pronto. No próximo push para `main` que toque em `app/supabase/migrations/**`
o workflow aplica automaticamente.

### Aplicar migrations pendentes agora (primeira vez)

A migration `20260415213345_harden_user_profiles_rls_and_consolidate_roles.sql`
já está em `main` mas nunca foi aplicada no banco. Depois de configurar os
secrets, faça:

1. Vá em https://github.com/lucasdierings/field-machine-rental/actions/workflows/supabase-migrate.yml
2. Clique em **Run workflow** (botão à direita)
3. Deixe `dry_run` **desmarcado** (ou marque para ver o que seria feito)
4. **Run workflow**

Em ~1 minuto o banco estará sincronizado. Migrations antigas que já foram
aplicadas são ignoradas automaticamente pelo `supabase db push`.

---

## Parte 2 — Rotacionar a anon key do Supabase

A `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key) foi removida dos arquivos atuais
pelo PR #10, mas ainda está no **histórico git** do repositório. Como o repo
é público (ou pode ter sido em algum momento), a chave antiga continua
acessível por quem tem o histórico. Para ficar 100% seguro, você precisa
rotacionar.

### Por que é relativamente seguro manter enquanto isso

A anon key é **pública por design** — todo SPA que usa Supabase embute ela
no bundle JavaScript que qualquer visitante baixa. A única coisa que protege
seu banco é a **RLS** (Row Level Security), que o PR #10 acabou de endurecer.
Então, no pior caso, um atacante com a anon key só consegue ver o que
qualquer usuário logado pode ver — que agora é muito restrito.

Mesmo assim, rotacionar é boa higiene.

### Passo a passo da rotação

1. **Gerar nova chave no Supabase**
   1. Abra https://supabase.com/dashboard/project/_/settings/api
   2. Na seção **Project API keys**, encontre a linha `anon` `public`
   3. Clique nos três pontinhos → **Reset** (ou **Regenerate**)
   4. Confirme. A nova chave aparece imediatamente.
   5. Copie a chave nova (começa com `eyJhbGci...`)

2. **Atualizar no Cloudflare Pages — App**
   1. https://dash.cloudflare.com/ → **Workers & Pages** → `field-machine-app`
   2. **Settings** → **Environment variables**
   3. Edite `VITE_SUPABASE_PUBLISHABLE_KEY` (ambiente **Production**)
   4. Cole a nova chave → **Save**

3. **Atualizar no Cloudflare Pages — Site**
   1. Mesmo caminho, mas no projeto `fieldmachine-site`
   2. Edite `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   3. Cole a mesma chave nova → **Save**

4. **Redeploy**
   1. Em ambos os projetos: **Deployments** → último deploy → **Retry deployment**
   2. Ou faça um commit vazio em `main`:
      ```
      git commit --allow-empty -m "chore: trigger redeploy after anon key rotation"
      git push
      ```

5. **Verificar**
   1. Abrir https://app.fieldmachine.com.br
   2. Fazer login → dashboard carrega → significa que a chave nova funciona
   3. Abrir https://fieldmachine.com.br → landing carrega

### E se algo quebrar?

A chave antiga fica válida até o Supabase finalizar a rotação (alguns
segundos). Se o app quebrar depois de trocar, volte no Cloudflare, troque
de novo a variável pela chave antiga (você ainda tem, mas não salva ela
de novo — só use para emergência) e investigue o que aconteceu.

---

## Parte 3 — Prompt para o Cowork (caso prefira não configurar manualmente)

Se você tem um agente no Cowork com acesso ao Supabase e ao GitHub, pode
colar este prompt:

```
Preciso configurar integração entre GitHub Actions e Supabase para aplicar
migrations automaticamente no projeto lucasdierings/field-machine-rental.

1. Acesse https://supabase.com/dashboard/account/tokens e gere um novo
   access token chamado "GitHub Actions — field-machine-rental". Copie.

2. Acesse https://supabase.com/dashboard → meu projeto Field Machine →
   Settings → General → copie o Reference ID.

3. Acesse Settings → Database. Se eu não souber a senha atual do banco,
   clique em Reset database password, confirme, e me salve a senha nova
   num gerenciador de senhas.

4. Vá em https://github.com/lucasdierings/field-machine-rental/settings/secrets/actions
   e crie estes 3 secrets:
   - SUPABASE_ACCESS_TOKEN = (o token do passo 1)
   - SUPABASE_PROJECT_ID = (o ref id do passo 2)
   - SUPABASE_DB_PASSWORD = (a senha do passo 3)

5. Vá em https://github.com/lucasdierings/field-machine-rental/actions/workflows/supabase-migrate.yml
   e clique em "Run workflow" (branch main, dry_run desmarcado). Isso vai
   aplicar as migrations pendentes no banco.

6. Aguarde o workflow terminar (verde ✓) e me avise. Se der erro, me copie
   o log.

Depois disso:

7. Me ajude a rotacionar a anon key do Supabase:
   - Supabase Dashboard → Settings → API → Reset na linha "anon public"
   - Copiar a nova chave
   - Cloudflare Pages → field-machine-app → Settings → Environment variables
     → editar VITE_SUPABASE_PUBLISHABLE_KEY → colar a nova
   - Cloudflare Pages → fieldmachine-site → editar
     NEXT_PUBLIC_SUPABASE_ANON_KEY → colar a mesma
   - Trigger redeploy em ambos os projetos
   - Testar: https://app.fieldmachine.com.br e https://fieldmachine.com.br
     devem carregar normalmente
```

---

## Checklist pós-setup

- [ ] Secrets configurados no GitHub (3 de 3)
- [ ] Workflow "Supabase Migrations" rodou ao menos 1 vez com sucesso
- [ ] Migration `20260415213345_harden_user_profiles_rls_and_consolidate_roles` aplicada
- [ ] Admin consegue entrar em `/admin` (está em `user_roles` com role=`admin`)
- [ ] Listagens de máquinas não vazam CPF/email/phone do dono (ver DevTools → Network)
- [ ] Anon key rotacionada no Supabase + atualizada no Cloudflare
- [ ] App e site carregam após rotação

---

## Problemas conhecidos

- **"Password authentication failed"** ao rodar o workflow: a senha do banco
  no secret `SUPABASE_DB_PASSWORD` está errada. Vá no Supabase → Database →
  Reset database password e atualize o secret.

- **"Project not found"**: o `SUPABASE_PROJECT_ID` está errado. Confira no
  Supabase → Settings → General → Reference ID (tem ~20 caracteres).

- **"Invalid access token"**: o token expirou ou foi revogado. Gere outro
  em Account → Access Tokens.

- **Migrations aparecem como "remote-only"**: significa que o estado do
  banco tem migrations que o código não conhece. Não rode `db push` antes
  de entender — pode sobrescrever algo. Neste caso peça ajuda.
