/**
 * Biometric authentication service
 * Works only on native platforms (iOS/Android) via Capacitor
 */

import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const BIOMETRIC_ENABLED_KEY = 'fieldmachine_biometric_enabled';
const BIOMETRIC_SESSION_KEY = 'fieldmachine_biometric_session';

interface BiometricPlugin {
  isAvailable(): Promise<{ isAvailable: boolean; biometryType?: string }>;
  authenticate(options: { reason: string; cancelTitle?: string }): Promise<void>;
}

// Dynamic import to avoid errors on web
async function getBiometricPlugin(): Promise<BiometricPlugin | null> {
  if (!Capacitor.isNativePlatform()) return null;

  try {
    const { NativeBiometric } = await import('capacitor-native-biometric');
    return NativeBiometric;
  } catch {
    return null;
  }
}

export async function isBiometricAvailable(): Promise<{ available: boolean; type: string }> {
  const plugin = await getBiometricPlugin();
  if (!plugin) return { available: false, type: '' };

  try {
    const result = await plugin.isAvailable();
    return { available: result.isAvailable, type: result.biometryType || 'biometria' };
  } catch {
    return { available: false, type: '' };
  }
}

export async function authenticateWithBiometric(): Promise<boolean> {
  const plugin = await getBiometricPlugin();
  if (!plugin) return false;

  try {
    await plugin.authenticate({
      reason: 'Confirme sua identidade para acessar o FieldMachine',
      cancelTitle: 'Usar senha',
    });
    return true;
  } catch {
    return false;
  }
}

export async function isBiometricEnabled(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;

  try {
    const { value } = await Preferences.get({ key: BIOMETRIC_ENABLED_KEY });
    return value === 'true';
  } catch {
    return false;
  }
}

export async function setBiometricEnabled(enabled: boolean): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  await Preferences.set({
    key: BIOMETRIC_ENABLED_KEY,
    value: enabled ? 'true' : 'false',
  });
}

export async function saveBiometricSession(refreshToken: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  await Preferences.set({
    key: BIOMETRIC_SESSION_KEY,
    value: refreshToken,
  });
}

export async function getBiometricSession(): Promise<string | null> {
  if (!Capacitor.isNativePlatform()) return null;

  try {
    const { value } = await Preferences.get({ key: BIOMETRIC_SESSION_KEY });
    return value;
  } catch {
    return null;
  }
}

export async function clearBiometricSession(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  await Preferences.remove({ key: BIOMETRIC_SESSION_KEY });
}

export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

export function getBiometricLabel(type: string): string {
  switch (type?.toLowerCase()) {
    case 'faceid':
    case 'face':
      return 'Face ID';
    case 'touchid':
    case 'fingerprint':
      return 'digital';
    default:
      return 'biometria';
  }
}
