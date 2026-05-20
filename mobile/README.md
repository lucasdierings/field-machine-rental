# 📱 Field Machine Mobile

Aplicativo móvel nativo iOS/Android da plataforma Field Machine, construído com **Capacitor** sobre o app web React existente.

## 🎯 Visão Geral

Este projeto **não duplica código**. Ele empacota o app web React (`../app`) em containers nativos iOS e Android, permitindo:

- ✅ 100% reutilização do código React/Tailwind/shadcn/ui
- ✅ Acesso a APIs nativas (câmera, GPS, push notifications, etc)
- ✅ Distribuição via App Store e Google Play
- ✅ Performance nativa com WebView otimizado
- ✅ Splash screen e status bar customizados

## 📋 Pré-requisitos

### Para desenvolvimento iOS:
- macOS com Xcode 14+ instalado
- CocoaPods (`sudo gem install cocoapods`)
- Conta Apple Developer (para testar em dispositivo físico)

### Para desenvolvimento Android:
- Android Studio instalado
- Java JDK 17+
- Android SDK configurado

### Geral:
- Node.js 18+ e npm
- App web React (`../app`) funcionando

## 🚀 Começando

### 1. Build inicial

```bash
# Na pasta mobile/
npm run sync
```

Este comando:
1. Faz build do app React (`cd ../app && npm run build`)
2. Copia o build para as pastas nativas iOS/Android
3. Sincroniza plugins nativos

### 2. Abrir projeto nativo

**iOS (Xcode):**
```bash
npm run open:ios
```

**Android (Android Studio):**
```bash
npm run open:android
```

### 3. Executar em simulador/emulador

**iOS:**
1. Abra o Xcode: `npm run open:ios`
2. Selecione um simulador (ex: iPhone 15 Pro)
3. Clique em "Run" (▶️)

**Android:**
1. Abra o Android Studio: `npm run open:android`
2. Crie um AVD (Android Virtual Device) se necessário
3. Clique em "Run" (▶️)

### 4. Executar em dispositivo físico

**iOS:**
1. Conecte o iPhone via USB
2. No Xcode: selecione seu dispositivo
3. Configure assinatura automática em "Signing & Capabilities"
4. Clique em "Run"

**Android:**
1. Habilite "Modo desenvolvedor" no Android
2. Conecte via USB e autorize depuração
3. No Android Studio: selecione o dispositivo
4. Clique em "Run"

## 📜 Scripts disponíveis

```bash
# Build do app web + sincronização completa
npm run sync

# Build + sincronizar apenas iOS
npm run sync:ios

# Build + sincronizar apenas Android
npm run sync:android

# Abrir Xcode
npm run open:ios

# Abrir Android Studio
npm run open:android

# Build + sincronizar + abrir iOS (atalho)
npm run run:ios

# Build + sincronizar + abrir Android (atalho)
npm run run:android
```

## 🔄 Workflow de desenvolvimento

### Desenvolvimento típico:

1. **Faça mudanças no código web** em `../app/src`
2. **Teste no navegador** primeiro: `cd ../app && npm run dev`
3. **Sincronize com mobile**: `npm run sync`
4. **Teste no simulador/dispositivo**

### Apenas mudanças de código (sem novos plugins):

```bash
npm run build:web  # Rebuild do app web
npx cap copy       # Copia arquivos (sem sync completo)
```

### Adicionar novo plugin nativo:

```bash
npm install @capacitor/camera  # Exemplo: plugin de câmera
npm run sync                   # Sincronizar com projetos nativos
```

## 🛠️ Estrutura do projeto

```
mobile/
├── android/              # Projeto Android nativo (gerado)
├── ios/                  # Projeto iOS nativo (gerado)
├── src/
│   └── capacitor-plugins.ts  # Helper para inicializar plugins
├── capacitor.config.ts   # Configuração do Capacitor
├── package.json          # Scripts e dependências mobile
└── README.md             # Este arquivo
```

## 🔌 Integrando plugins nativos no React

### 1. Copie o arquivo helper para o app web:

```bash
cp src/capacitor-plugins.ts ../app/src/lib/
```

### 2. No `../app/src/main.tsx`, adicione:

```typescript
import { initializeNativePlugins } from './lib/capacitor-plugins';

// Logo após o ReactDOM.createRoot
initializeNativePlugins().catch(console.error);
```

### 3. Instale as dependências no app web:

```bash
cd ../app
npm install @capacitor/core @capacitor/splash-screen @capacitor/status-bar
```

## 🎨 Customização

### Ícone do app

Coloque um ícone 1024x1024px em `android/app/src/main/res/` e `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

Ou use: `npm install -g @capacitor/assets && npx capacitor-assets generate`

### Splash Screen

Edite as cores em `capacitor.config.ts`:

```typescript
SplashScreen: {
  backgroundColor: '#16a34a',  // Cor de fundo
  launchShowDuration: 2000     // Duração em ms
}
```

### Status Bar

Altere estilo e cor em `capacitor.config.ts`:

```typescript
StatusBar: {
  style: 'dark',              // 'light' ou 'dark'
  backgroundColor: '#16a34a'  // Cor (apenas Android)
}
```

## 🐛 Troubleshooting

### "Could not find installation of TypeScript"
```bash
npm install -D typescript
```

### "missing ../app/dist directory"
```bash
cd ../app && npm run build
```

### Mudanças não aparecem no app
```bash
npm run sync  # Sempre sincronize após mudanças
```

### Plugin não funciona
```bash
npx cap sync  # Re-sincronizar plugins
```

### Erro ao abrir Xcode/Android Studio
- iOS: Verifique se CocoaPods está instalado: `pod --version`
- Android: Verifique se JAVA_HOME está configurado

## 📚 Recursos

- [Documentação Capacitor](https://capacitorjs.com/docs)
- [Plugins oficiais](https://capacitorjs.com/docs/apis)
- [Guia de workflow](https://capacitorjs.com/docs/basics/workflow)
- [Community plugins](https://github.com/capacitor-community)

## 🚢 Deploy para produção

### iOS (App Store):

1. Configure certificados em Xcode
2. Archive: `Product > Archive`
3. Upload para App Store Connect
4. Submeta para revisão

### Android (Google Play):

1. Gere keystore: [Guia oficial](https://capacitorjs.com/docs/android/deploying-to-google-play)
2. Build release: `cd android && ./gradlew assembleRelease`
3. Upload para Google Play Console
4. Submeta para revisão

## 📝 Notas importantes

- **NÃO edite código em `android/` ou `ios/` diretamente** (será sobrescrito)
- **Sempre teste no web primeiro** antes de sincronizar mobile
- **Faça `npm run sync`** após instalar novos plugins Capacitor
- **Mantenha Capacitor atualizado** para correções de segurança

---

**Desenvolvido com ❤️ para Field Machine Brasil**
