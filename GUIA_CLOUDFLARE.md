# 🚀 Guia de Configuração Cloudflare Pages

## ⚠️ PROBLEMA IDENTIFICADO

O app está em branco porque as **variáveis de ambiente não foram configuradas no Cloudflare** antes do build.

**Evidência:**
- O JavaScript em produção contém strings literais `VITE_SUPABASE` ao invés dos valores reais
- Isso faz o Supabase client falhar ao inicializar
- React não consegue renderizar nada, resultando em tela branca

---

## 📋 PASSO A PASSO - Configuração do App

### 1. Acessar Cloudflare Pages
1. Acesse: https://dash.cloudflare.com
2. Vá em **Workers & Pages** no menu lateral
3. Clique no projeto **field-machine-app**

### 2. Configurar Variáveis de Ambiente
1. Clique na aba **Settings**
2. Role até **Environment variables**
3. Clique em **Add variable** para cada uma abaixo:

#### Variáveis de Produção (Production)
```
Variable name: VITE_SUPABASE_URL
Value: https://uynscjoomsiryqnyeohm.supabase.co
```

```
Variable name: VITE_SUPABASE_PUBLISHABLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bnNjam9vbXNpcnlxbnllb2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzQ4NjcsImV4cCI6MjA3MzMxMDg2N30.NefR4o3XLW8uN3UHeLIpiU7tBA--SRkO0U6o0m6Vn-4
```

**⚠️ IMPORTANTE:** Selecione **Production** no dropdown de ambiente!

### 3. Verificar Build Settings
1. Ainda em **Settings**, vá para **Builds & deployments**
2. Verifique se está configurado assim:

```
Framework preset: None (ou Vite)
Build command: npm run build
Build output directory: dist
Root directory: app
```

### 4. Trigger Novo Deploy
Depois de configurar as variáveis:

**Opção A - Via Git (Recomendado):**
```bash
# No seu terminal local
cd /Users/lucasdierings/Documents/GitHub/field-machine-rental
git add .
git commit -m "fix: adiciona .env.production ao gitignore"
git push origin main
```

**Opção B - Via Cloudflare Dashboard:**
1. Vá na aba **Deployments**
2. Clique nos 3 pontinhos do último deploy
3. Clique em **Retry deployment**

### 5. Aguardar Deploy
- O build leva ~2-3 minutos
- Acompanhe o progresso na aba **Deployments**
- Quando aparecer ✅ **Success**, o app estará pronto

### 6. Testar
1. Acesse: https://app.fieldmachine.com.br
2. Você deve ver a página inicial do FieldMachine
3. Teste o login/cadastro

---

## 📋 PASSO A PASSO - Configuração do Site

### 1. Acessar Projeto do Site
1. Volte para **Workers & Pages**
2. Clique no projeto **fieldmachine-site**

### 2. Configurar Variáveis de Ambiente
Adicione as seguintes variáveis em **Production**:

```
Variable name: NEXT_PUBLIC_SUPABASE_URL
Value: https://uynscjoomsiryqnyeohm.supabase.co
```

```
Variable name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bnNjam9vbXNpcnlxbnllb2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzQ4NjcsImV4cCI6MjA3MzMxMDg2N30.NefR4o3XLW8uN3UHeLIpiU7tBA--SRkO0U6o0m6Vn-4
```

### 3. Verificar Build Settings
```
Framework preset: Next.js
Build command: npm run build
Build output directory: out
Root directory: site
```

### 4. Configurar Domínio www
1. Vá em **Custom domains**
2. Clique em **Set up a custom domain**
3. Digite: `www.fieldmachine.com.br`
4. Siga as instruções para configurar DNS

**Nota:** Se o DNS já está configurado mas não resolve, pode levar até 24h para propagar.

### 5. Trigger Deploy
```bash
git push origin main
```

---

## 🔍 Verificação Pós-Deploy

### Checklist App
- [ ] https://app.fieldmachine.com.br carrega a página inicial
- [ ] Não há tela branca
- [ ] Console do navegador não mostra erros de Supabase
- [ ] Login funciona
- [ ] Cadastro funciona

### Checklist Site
- [ ] https://www.fieldmachine.com.br resolve (DNS)
- [ ] Página inicial carrega
- [ ] Imagens aparecem
- [ ] Links funcionam

---

## 🐛 Troubleshooting

### App ainda está em branco
1. Verifique se as variáveis foram salvas (Settings → Environment variables)
2. Certifique-se que selecionou **Production** (não Preview)
3. Faça um novo deploy (Retry deployment)
4. Limpe o cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R)

### Site não carrega (DNS)
1. Verifique se o domínio está em **Custom domains**
2. Confirme que os registros DNS estão corretos no seu provedor
3. Aguarde até 24h para propagação DNS
4. Use https://dnschecker.org para verificar propagação

### Erro de CORS
1. Vá no Supabase Dashboard
2. Settings → API → CORS
3. Adicione:
   - https://app.fieldmachine.com.br
   - https://www.fieldmachine.com.br

### Build falha
1. Verifique os logs na aba **Deployments**
2. Procure por erros de TypeScript ou dependências
3. Teste o build localmente: `npm run build`

---

## 📞 Próximos Passos

Após configurar tudo:

1. **Commit local:**
   ```bash
   git add .
   git commit -m "docs: adiciona guia de configuração Cloudflare"
   git push origin main
   ```

2. **Aguardar deploy automático**

3. **Testar em produção:**
   - Criar conta
   - Fazer login
   - Adicionar máquina
   - Fazer booking

4. **Monitoramento:**
   - Configurar Google Analytics
   - Configurar Sentry para error tracking
   - Configurar alertas de uptime

---

## ✅ Quando Tudo Estiver Funcionando

- [ ] App acessível em https://app.fieldmachine.com.br
- [ ] Site acessível em https://www.fieldmachine.com.br
- [ ] SSL/HTTPS funcionando
- [ ] Autenticação funcionando
- [ ] Uploads de documentos funcionando
- [ ] Bookings funcionando
- [ ] Sem erros no console

**Parabéns! 🎉 Seu projeto está em produção!**
