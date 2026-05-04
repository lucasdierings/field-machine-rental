# 🚀 Quickstart - Field Machine Mobile

Guia de 5 minutos para rodar o app mobile pela primeira vez.

## ⚡ Setup rápido

### 1. Instale as dependências (se ainda não fez)

```bash
cd mobile
npm install
```

### 2. Faça o primeiro build

```bash
npm run sync
```

Isso vai:
- ✅ Compilar o app web React
- ✅ Copiar para iOS/Android
- ✅ Configurar plugins nativos

### 3. Escolha sua plataforma

#### Para iOS (Mac apenas):

```bash
npm run open:ios
```

No Xcode:
1. Selecione um simulador (ex: iPhone 15 Pro)
2. Clique em "Run" (▶️)
3. Aguarde o build (~2min na primeira vez)

#### Para Android:

```bash
npm run open:android
```

No Android Studio:
1. Aguarde o Gradle sync terminar
2. Selecione um emulador ou dispositivo físico
3. Clique em "Run" (▶️)
4. Aguarde o build (~3min na primeira vez)

## ✅ Checklist antes de começar

- [ ] Node.js 18+ instalado
- [ ] App web rodando: `cd ../app && npm run dev`
- [ ] **iOS**: Xcode 14+ instalado (Mac apenas)
- [ ] **iOS**: CocoaPods instalado: `sudo gem install cocoapods`
- [ ] **Android**: Android Studio instalado
- [ ] **Android**: Java JDK 17+ configurado

## 🔧 Comandos úteis

```bash
# Rebuild e sincronizar (use após mudanças no código)
npm run sync

# Abrir Xcode
npm run open:ios

# Abrir Android Studio
npm run open:android

# Build rápido sem sync completo
npm run build:web && npx cap copy
```

## ❓ Problemas comuns

### "missing ../app/dist directory"

```bash
cd ../app && npm run build
```

### Mudanças não aparecem no app

```bash
npm run sync  # Sempre sincronize após alterar código
```

### Erro no iOS: "CocoaPods not installed"

```bash
sudo gem install cocoapods
```

### Erro no Android: "JAVA_HOME not set"

Instale o JDK 17 e configure JAVA_HOME:
```bash
export JAVA_HOME=/path/to/jdk-17
```

## 📱 Próximos passos

1. **Leia o [README.md](./README.md)** para entender o workflow completo
2. **Veja [src/example-usage.tsx](./src/example-usage.tsx)** para usar features nativas
3. **Customize ícone e splash screen** (instruções no README)
4. **Teste em dispositivo físico** para melhor performance

## 🎯 Workflow de desenvolvimento recomendado

1. Desenvolva no app web: `cd ../app && npm run dev`
2. Teste no navegador primeiro
3. Quando estiver ok, sincronize mobile: `cd ../mobile && npm run sync`
4. Teste no simulador/emulador
5. Repita! 🔄

---

**Pronto para começar? Execute:** `npm run sync && npm run open:ios`
