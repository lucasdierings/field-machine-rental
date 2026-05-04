# 🔗 Integrando Mobile com App Web

Este guia mostra como integrar as funcionalidades nativas do Capacitor no app web React existente.

## 📦 Passo 1: Instalar dependências no app web

```bash
cd ../app
npm install @capacitor/core @capacitor/splash-screen @capacitor/status-bar
```

## 🎯 Passo 2: Copiar arquivo de plugins

```bash
# Da pasta mobile/, execute:
cp src/capacitor-plugins.ts ../app/src/lib/capacitor-plugins.ts
```

## ⚙️ Passo 3: Inicializar plugins no app

Edite `../app/src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeNativePlugins } from './lib/capacitor-plugins';
import './index.css';

// Inicializar plugins nativos
initializeNativePlugins().catch(console.error);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 🎨 Passo 4: Usar funcionalidades nativas nos componentes

### Exemplo: Detectar se está no mobile

```typescript
import { isNative, getPlatform } from '@/lib/capacitor-plugins';

function MyComponent() {
  if (isNative()) {
    return <div>Você está no app nativo! ({getPlatform()})</div>;
  }
  return <div>Você está no navegador web</div>;
}
```

### Exemplo: Adicionar botão apenas no mobile

```typescript
import { isNative } from '@/lib/capacitor-plugins';
import { Camera } from '@capacitor/camera';

function ProfilePhoto() {
  const handleTakePhoto = async () => {
    const photo = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
    });
    // Use photo.webPath
  };

  return (
    <div>
      {isNative() && (
        <button onClick={handleTakePhoto}>
          📸 Tirar Foto
        </button>
      )}
      {!isNative() && (
        <input type="file" accept="image/*" />
      )}
    </div>
  );
}
```

## 📱 Passo 5: Testar mudanças

```bash
# 1. Desenvolver e testar no navegador
cd ../app
npm run dev

# 2. Quando estiver ok, sincronizar com mobile
cd ../mobile
npm run sync

# 3. Testar no simulador
npm run open:ios  # ou open:android
```

## 🔌 Plugins nativos recomendados para Field Machine

### 1. Câmera (para foto de documentos/máquinas)

```bash
cd mobile
npm install @capacitor/camera
npm run sync
```

```typescript
import { Camera, CameraResultType } from '@capacitor/camera';

const photo = await Camera.getPhoto({
  quality: 90,
  allowEditing: true,
  resultType: CameraResultType.Uri,
});
```

### 2. Geolocalização (para localizar máquinas)

```bash
cd mobile
npm install @capacitor/geolocation
npm run sync
```

```typescript
import { Geolocation } from '@capacitor/geolocation';

const position = await Geolocation.getCurrentPosition();
const { latitude, longitude } = position.coords;
```

### 3. Compartilhamento (compartilhar máquinas)

```bash
cd mobile
npm install @capacitor/share
npm run sync
```

```typescript
import { Share } from '@capacitor/share';

await Share.share({
  title: 'Confira esta máquina!',
  text: 'Trator John Deere disponível para aluguel',
  url: 'https://fieldmachine.com.br/machine/123',
});
```

### 4. Push Notifications (notificações de reservas)

```bash
cd mobile
npm install @capacitor/push-notifications
npm run sync
```

```typescript
import { PushNotifications } from '@capacitor/push-notifications';

await PushNotifications.requestPermissions();
await PushNotifications.register();
```

### 5. Armazenamento local (cache offline)

```bash
cd mobile
npm install @capacitor/preferences
npm run sync
```

```typescript
import { Preferences } from '@capacitor/preferences';

await Preferences.set({ key: 'user_id', value: '123' });
const { value } = await Preferences.get({ key: 'user_id' });
```

## 🧪 Testando features nativas

### Opção 1: Usar exemplo pronto

```bash
# Copiar componente de exemplo
cp mobile/src/example-usage.tsx app/src/components/NativeFeaturesDemo.tsx

# Adicionar na rota (ex: /debug)
// Em App.tsx
import { NativeFeaturesDemo } from '@/components/NativeFeaturesDemo';
<Route path="/debug" element={<NativeFeaturesDemo />} />
```

### Opção 2: Criar hook customizado

```typescript
// app/src/hooks/useNativeCamera.ts
import { useState } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { isNative } from '@/lib/capacitor-plugins';

export function useNativeCamera() {
  const [photo, setPhoto] = useState<string | null>(null);

  const takePhoto = async () => {
    if (!isNative()) {
      console.warn('Câmera disponível apenas no app nativo');
      return null;
    }

    try {
      const result = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
      });
      setPhoto(result.webPath || null);
      return result.webPath;
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      return null;
    }
  };

  return { photo, takePhoto };
}
```

## 🚨 Boas práticas

### 1. Sempre checar se está no mobile

```typescript
import { isNative } from '@/lib/capacitor-plugins';

if (!isNative()) {
  console.warn('Feature disponível apenas no app mobile');
  return;
}
```

### 2. Graceful degradation

```typescript
// Mobile: usar câmera nativa
// Web: usar input file
{isNative() ? (
  <button onClick={takePhoto}>📸 Tirar Foto</button>
) : (
  <input type="file" accept="image/*" />
)}
```

### 3. Testar sempre no navegador primeiro

```bash
# Workflow recomendado:
# 1. cd ../app && npm run dev
# 2. Testar no Chrome
# 3. cd ../mobile && npm run sync
# 4. Testar no simulador
```

### 4. Tratar erros de permissão

```typescript
try {
  const position = await Geolocation.getCurrentPosition();
} catch (error) {
  if (error.code === 'PERMISSION_DENIED') {
    alert('Por favor, habilite permissões de localização');
  }
}
```

## 📖 Referências

- [Lista completa de plugins](https://capacitorjs.com/docs/apis)
- [Community plugins](https://github.com/capacitor-community)
- [Guia de APIs nativas](https://capacitorjs.com/docs/apis/android)

## 🎯 Checklist de integração

- [ ] Plugins instalados no `mobile/`
- [ ] `npm run sync` executado
- [ ] Dependências instaladas no `app/`
- [ ] `capacitor-plugins.ts` copiado para `app/src/lib/`
- [ ] `initializeNativePlugins()` chamado no `main.tsx`
- [ ] Testado no navegador (deve funcionar sem erros)
- [ ] Testado no simulador/emulador
- [ ] Testado em dispositivo físico

---

**Pronto! Agora seu app web tem superpoderes nativos** 🚀
