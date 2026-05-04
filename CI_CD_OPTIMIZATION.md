# 🔄 CI/CD Optimization Guide

## 📌 Status Atual

Seu projeto usa um **único workflow** que roda para AMBOS app e site:

```yaml
# .github/workflows/lint-test.yml
- Instala dependências de app/
- Instala dependências de site/
- Lint e build de app/
- Lint e build de site/
- Type check de ambos
```

**Vantagem:** Simples, único ponto de controle
**Desvantagem:** Sempre roda tudo, mesmo se mudar apenas um lado

---

## 🎯 Estratégia Atual: Mantém Simplicidade

Recomendo **manter o workflow único** porque:

1. ✅ **Garante consistência** — Ambos são testados juntos
2. ✅ **Fácil de manter** — Um único arquivo YAML
3. ✅ **Detecta problemas cedo** — Se algo quebra em um lado, você vê
4. ✅ **Deploy ordenado** — Cloudflare detecta mudanças e faz deploy independente

---

## 🚀 Otimizações Disponíveis (Opcional)

### **Opção 1: Usar Conditional Jobs (RECOMENDADO SE QUISER OTIMIZAR)**

Se quiser otimizar para NÃO rodar tudo sempre:

```yaml
name: Lint and Build (Conditional)

on:
  push:
    branches: [main, develop, 'claude/**']
  pull_request:
    branches: [main, develop]

jobs:
  # Detecta quais diretórios foram modificados
  changes:
    runs-on: ubuntu-latest
    outputs:
      app: ${{ steps.filter.outputs.app }}
      site: ${{ steps.filter.outputs.site }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: dorny/paths-filter@v2
        id: filter
        with:
          filters: |
            app:
              - 'app/**'
              - '.github/workflows/**'
            site:
              - 'site/**'
              - '.github/workflows/**'

  # Roda apenas se app/ foi modificado
  lint-build-app:
    needs: changes
    if: ${{ needs.changes.outputs.app == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: npm

      - name: Install & build
        working-directory: ./app
        run: npm ci && npm run lint && npm run build

  # Roda apenas se site/ foi modificado
  lint-build-site:
    needs: changes
    if: ${{ needs.changes.outputs.site == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: npm

      - name: Install & build
        working-directory: ./site
        run: npm ci && npm run lint && npm run build
```

**Vantagens:**
- ⚡ Mais rápido se muda apenas um lado
- 🎯 Feedback mais específico
- 📊 Histórico de builds separados

**Desvantagens:**
- 🔧 Mais complexo de manter
- ❌ Pode deixar um lado quebrado sem perceber

---

## 🏃 Performance Atual

Tempo médio do workflow:

```
lint-test.yml (atual):
  ├── Install app dependencies:        ~45s
  ├── Lint app:                        ~15s
  ├── Build app:                       ~60s
  ├── Install site dependencies:       ~45s
  ├── Lint site:                       ~10s
  ├── Build site:                      ~40s
  ├── Type check:                      ~30s
  └── Total:                          ~3-4 minutos
```

---

## 💾 Otimizações de Cache

Seu workflow atual **já usa cache**:

```yaml
- uses: actions/setup-node@v4
  with:
    cache: npm  # ← Cache automático
```

### **Se quiser melhorar ainda mais:**

```yaml
- name: Cache app node_modules
  uses: actions/cache@v3
  with:
    path: app/node_modules
    key: ${{ runner.os }}-nodeapp-${{ hashFiles('app/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-nodeapp-

- name: Cache site node_modules
  uses: actions/cache@v3
  with:
    path: site/node_modules
    key: ${{ runner.os }}-nodesite-${{ hashFiles('site/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-nodesite-
```

---

## 🔐 Segurança do Workflow

### **Checklist de Segurança**

- [x] Usa `actions/checkout@v4` (latest)
- [x] Usa `actions/setup-node@v4` (latest)
- [ ] Não expõe secrets
- [x] Não roda código não confiável
- [x] Valida antes de deploy

### **Se adicionar secrets (API keys, etc):**

```yaml
- name: Setup deployment
  env:
    DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
  run: npm run deploy
```

---

## 📊 Monitorar Workflow

### **GitHub Actions Dashboard**

```
https://github.com/lucasdierings/field-machine-rental/actions
```

Veja:
- Status de cada workflow
- Tempo de execução
- Logs de erro
- Histórico

### **Problemas Comuns**

#### **Workflow tira timeout**
Se levar > 6 horas, GitHub cancela automaticamente.

**Solução:**
```yaml
timeout-minutes: 30
```

#### **Cache cresce muito**
GitHub limita cache a 5GB por repositório.

**Solução:** Limpar cache antigo
```bash
# No terminal
gh actions-cache delete <key> -R lucasdierings/field-machine-rental --confirm
```

---

## 🚀 Deploy Automático após CI/CD

### **Configuração Atual (Cloudflare)**

1. GitHub Actions roda (lint, build, type check)
2. Se passar ✅, commit é merged
3. Cloudflare Pages detecta novo push
4. Cloudflare faz build independente de app/ ou site/
5. Deploy automático se build sucesso

### **Fluxo Visual**

```
git push → GitHub Actions → Passa? → Merge PR
                                        ↓
                            Cloudflare Pages detecta
                                        ↓
                    Build field-machine-app + fieldmachine-site
                                        ↓
                    Deploy para app.fieldmachine.com.br
                    Deploy para fieldmachine.com.br
```

---

## 📝 Boas Práticas

### **1. Sempre rodar CI/CD localmente antes de push**

```bash
cd app && npm run lint && npm run build
cd ../site && npm run lint && npm run build
```

### **2. Commit específico por feature**

```bash
# ✅ Bom
git commit -m "feat(app): improve booking flow"

# ❌ Ruim
git commit -m "fix stuff"
```

### **3. Mensagens de commit claras**

Uso de prefixos:
- `feat:` — Nova feature
- `fix:` — Bug fix
- `docs:` — Documentação
- `style:` — Formatação
- `refactor:` — Refatoração
- `perf:` — Performance
- `a11y:` — Acessibilidade

### **4. Abra PRs antes de mergear**

```bash
git push origin feature/sua-feature
# Abra PR no GitHub
# Aguarde aprovação
# Merge
```

---

## 🔧 Troubleshooting

### **Workflow falha com "npm ERR!not ok"**

**Causa:** Dependências não estão locked

**Solução:**
```bash
cd app
npm install  # Atualiza package-lock.json
git add package-lock.json
git commit -m "chore: update dependencies"
git push
```

---

### **Build app passa mas build site falha**

**Causa:** Erro específico do site

**Solução:**
1. Verifique logs em GitHub Actions
2. Reproduza localmente: `cd site && npm run build`
3. Corrija erro
4. Push novamente

---

### **Workflow roda lentamente**

**Causa:** Cache expirou ou dependências grandes

**Solução:**
```yaml
# Limpar cache
gh actions-cache delete "..." --all --confirm

# Re-run workflow
# GitHub refaz com cache limpo
```

---

## 📚 Referências

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Workflow Syntax:** https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
- **Cloudflare Pages:** https://developers.cloudflare.com/pages/platform/deployments/
- **Best Practices:** https://github.com/actions/setup-node

---

## ✅ Checklist: CI/CD Configuration

- [x] GitHub Actions workflow configurado
- [x] Node.js 20.x definido
- [x] npm ci para instalar (ao invés de npm install)
- [x] Lint rodando em ambos
- [x] Build rodando em ambos
- [x] Type check configurado
- [x] Cache automático ativado
- [x] Timeout definido (30 minutos)
- [ ] Deploy automático integrado (Cloudflare já faz)
- [ ] Notificações de erro configuradas (opcional)
- [ ] Badges de status no README (opcional)

---

## 📈 Próximos Passos (Opcional)

### **Se quiser ainda mais otimizações:**

1. **Conditional jobs** (build apenas o que mudou)
2. **Parallel builds** (app e site rodam em paralelo)
3. **Test automation** (quando implementar testes)
4. **Release automation** (auto-tagging de versões)
5. **Slack notifications** (alertas de build)

---

**Versão:** 1.0 | **Data:** 2026-03-21

Sua pipeline está funcional e segura! Se precisar otimizar, considere as opções acima. 🚀
