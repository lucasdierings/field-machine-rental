/**
 * Exemplos de uso de plugins Capacitor no React
 *
 * Copie estes exemplos para seus componentes no ../app/src
 */

import { Camera, CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Share } from '@capacitor/share';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { isNative, getPlatform } from './capacitor-plugins';

// ===========================
// 📸 EXEMPLO: Tirar foto
// ===========================
export async function takePicture() {
  if (!isNative()) {
    console.log('Câmera disponível apenas no app nativo');
    return null;
  }

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });

    return image.webPath; // URL da imagem para usar em <img src={} />
  } catch (error) {
    console.error('Erro ao tirar foto:', error);
    return null;
  }
}

// ===========================
// 📍 EXEMPLO: Obter localização GPS
// ===========================
export async function getCurrentLocation() {
  if (!isNative()) {
    console.log('GPS disponível apenas no app nativo');
    return null;
  }

  try {
    const position = await Geolocation.getCurrentPosition();

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
    };
  } catch (error) {
    console.error('Erro ao obter localização:', error);
    return null;
  }
}

// ===========================
// 📤 EXEMPLO: Compartilhar conteúdo
// ===========================
export async function shareContent(title: string, text: string, url?: string) {
  if (!isNative()) {
    console.log('Compartilhamento disponível apenas no app nativo');
    return;
  }

  try {
    await Share.share({
      title,
      text,
      url,
      dialogTitle: 'Compartilhar via',
    });
  } catch (error) {
    console.error('Erro ao compartilhar:', error);
  }
}

// ===========================
// 📳 EXEMPLO: Feedback háptico (vibração)
// ===========================
export async function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'medium') {
  if (!isNative()) return;

  const styles = {
    light: ImpactStyle.Light,
    medium: ImpactStyle.Medium,
    heavy: ImpactStyle.Heavy,
  };

  try {
    await Haptics.impact({ style: styles[type] });
  } catch (error) {
    console.error('Erro no feedback háptico:', error);
  }
}

// ===========================
// 🎨 COMPONENTE DE EXEMPLO
// ===========================
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function NativeFeaturesDemo() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleTakePhoto = async () => {
    const photoUrl = await takePicture();
    if (photoUrl) setPhoto(photoUrl);
  };

  const handleGetLocation = async () => {
    const coords = await getCurrentLocation();
    if (coords) setLocation(coords);
  };

  const handleShare = async () => {
    await shareContent(
      'Field Machine',
      'Confira a plataforma de aluguel de máquinas agrícolas!',
      'https://fieldmachine.com.br'
    );
  };

  if (!isNative()) {
    return (
      <div className="p-4 text-center">
        <p>⚠️ Features nativas disponíveis apenas no app mobile</p>
        <p className="text-sm text-muted-foreground mt-2">
          Plataforma atual: {getPlatform()}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Demo de Features Nativas</h2>

      <div className="space-y-2">
        <Button onClick={handleTakePhoto} className="w-full">
          📸 Tirar Foto
        </Button>
        {photo && (
          <img src={photo} alt="Foto capturada" className="w-full rounded-lg" />
        )}
      </div>

      <div className="space-y-2">
        <Button onClick={handleGetLocation} className="w-full">
          📍 Obter Localização
        </Button>
        {location && (
          <div className="text-sm">
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
          </div>
        )}
      </div>

      <Button onClick={handleShare} className="w-full">
        📤 Compartilhar App
      </Button>

      <Button onClick={() => triggerHaptic('medium')} className="w-full">
        📳 Testar Vibração
      </Button>
    </div>
  );
}

// ===========================
// 📦 PLUGINS A INSTALAR
// ===========================
/*
Para usar estes exemplos, instale os plugins necessários:

cd mobile/
npm install @capacitor/camera @capacitor/geolocation @capacitor/share @capacitor/haptics

Depois sincronize:
npm run sync
*/
