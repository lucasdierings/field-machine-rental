/**
 * Biometric authentication service
 * Works only on native platforms (iOS/Android) via Capacitor
 * All imports are dynamic to avoid build errors on web
 */

const BIOMETRIC_ENABLED_KEY = 'fieldmachine_biometric_enabled';
const BIOMETRIC_SESSION_KEY = 'fieldmachine_biometric_session';

// Check if running inside Capacitor native shell
function isNativeCheck(): boolean {
  try {
    return !!(window as any).Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
}

export function isNativePlatform(): boolean {
  return isNativeCheck();
}

async function getBiometricPlugin() {
  if (!isNativeCheck()) return null;
  try {
    const mod = await import('capacitor-native-biometric');
    return mod.NativeBiometric;
  } catch {
    return null;
  }
}

async function getPreferences() {
  if (!isNativeCheck()) return null;
  try {
    const mod = await import('@capacitor/preferences');
    return mod.Preferences;
  } catch {
    return null;
  }
}

// Fallback to localStorage when Preferences plugin is unavailable
async function getStoredValue(key: string): Promise<string | null> {
  const prefs = await getPreferences();
  if (prefs) {
    const { value } = await prefs.get({ key });
    return value;
  }
  return localStorage.getItem(key);
}

async function setStoredValue(key: string, value: string): Promise<void> {
  const prefs = await getPreferences();
  if (prefs) {
    await prefs.set({ key, value });
  } else {
    localStorage.setItem(key, value);
  }
}

async function removeStoredValue(key: string): Promise<void> {
  const prefs = await getPreferences();
  if (prefs) {
    await prefs.remove({ key });
  } else {
    localStorage.removeItem(key);
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
  if (!isNativeCheck()) return false;
  try {
    const value = await getStoredValue(BIOMETRIC_ENABLED_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

export async function setBiometricEnabled(enabled: boolean): Promise<void> {
  if (!isNativeCheck()) return;
  await setStoredValue(BIOMETRIC_ENABLED_KEY, enabled ? 'true' : 'false');
}

export async function saveBiometricSession(refreshToken: string): Promise<void> {
  if (!isNativeCheck()) return;
  await setStoredValue(BIOMETRIC_SESSION_KEY, refreshToken);
}

export async function getBiometricSession(): Promise<string | null> {
  if (!isNativeCheck()) return null;
  try {
    return await getStoredValue(BIOMETRIC_SESSION_KEY);
  } catch {
    return null;
  }
}

export async function clearBiometricSession(): Promise<void> {
  if (!isNativeCheck()) return;
  await removeStoredValue(BIOMETRIC_SESSION_KEY);
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
