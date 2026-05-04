/**
 * Biometric authentication service
 * Uses NativeBiometric for secure Keychain/Keystore storage
 * All imports are dynamic to avoid build errors on web
 */

const BIOMETRIC_ENABLED_KEY = 'fieldmachine_biometric_enabled';
const BIOMETRIC_ASKED_KEY = 'fieldmachine_biometric_asked';
const CREDENTIALS_SERVER = 'com.fieldmachine.auth';

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

// ─── Plugin loaders (dynamic to avoid web build errors) ─────────────────────

async function getNativeBiometric() {
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

// ─── Preferences helpers ────────────────────────────────────────────────────

async function getPref(key: string): Promise<string | null> {
  const prefs = await getPreferences();
  if (!prefs) return null;
  try {
    const { value } = await prefs.get({ key });
    return value;
  } catch {
    return null;
  }
}

async function setPref(key: string, value: string): Promise<void> {
  const prefs = await getPreferences();
  if (!prefs) return;
  await prefs.set({ key, value });
}

async function removePref(key: string): Promise<void> {
  const prefs = await getPreferences();
  if (!prefs) return;
  await prefs.remove({ key });
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Check if device supports biometric auth
 */
export async function isBiometricAvailable(): Promise<{ available: boolean; type: string }> {
  const plugin = await getNativeBiometric();
  if (!plugin) return { available: false, type: '' };

  try {
    const result = await plugin.isAvailable();
    return {
      available: result.isAvailable,
      type: result.biometryType?.toString() || 'biometria',
    };
  } catch {
    return { available: false, type: '' };
  }
}

/**
 * Save credentials securely in Keychain/Keystore (requires biometric to retrieve)
 */
export async function saveBiometricCredentials(email: string, refreshToken: string): Promise<boolean> {
  const plugin = await getNativeBiometric();
  if (!plugin) return false;

  try {
    await plugin.setCredentials({
      username: email,
      password: refreshToken,
      server: CREDENTIALS_SERVER,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Prompt biometric auth and return saved credentials
 */
export async function getBiometricCredentials(): Promise<{ email: string; refreshToken: string } | null> {
  const plugin = await getNativeBiometric();
  if (!plugin) return null;

  try {
    // This triggers the biometric prompt (Face ID / Touch ID / fingerprint)
    await plugin.verifyIdentity({
      reason: 'Confirme sua identidade para acessar o FieldMachine',
      title: 'Autenticacao',
      subtitle: 'Use biometria para entrar',
      description: '',
    });

    // If biometric succeeded, get the stored credentials
    const credentials = await plugin.getCredentials({ server: CREDENTIALS_SERVER });
    return {
      email: credentials.username,
      refreshToken: credentials.password,
    };
  } catch {
    return null;
  }
}

/**
 * Remove saved credentials from Keychain/Keystore
 */
export async function removeBiometricCredentials(): Promise<void> {
  const plugin = await getNativeBiometric();
  if (!plugin) return;

  try {
    await plugin.deleteCredentials({ server: CREDENTIALS_SERVER });
  } catch {
    // Credentials may not exist, that's fine
  }
}

/**
 * Check if user has enabled biometric login
 */
export async function isBiometricEnabled(): Promise<boolean> {
  if (!isNativeCheck()) return false;
  try {
    const value = await getPref(BIOMETRIC_ENABLED_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

/**
 * Enable or disable biometric login preference
 */
export async function setBiometricEnabled(enabled: boolean): Promise<void> {
  if (!isNativeCheck()) return;
  await setPref(BIOMETRIC_ENABLED_KEY, enabled ? 'true' : 'false');
}

/**
 * Check if we already asked the user about biometric setup
 */
export async function wasBiometricAsked(): Promise<boolean> {
  if (!isNativeCheck()) return true; // Don't ask on web
  try {
    const value = await getPref(BIOMETRIC_ASKED_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

/**
 * Mark that we asked about biometric setup
 */
export async function markBiometricAsked(): Promise<void> {
  if (!isNativeCheck()) return;
  await setPref(BIOMETRIC_ASKED_KEY, 'true');
}

/**
 * Full cleanup on logout
 */
export async function clearBiometricData(): Promise<void> {
  await removeBiometricCredentials();
  await removePref(BIOMETRIC_ENABLED_KEY);
  await removePref(BIOMETRIC_ASKED_KEY);
}

/**
 * Get human-readable label for biometric type
 */
export function getBiometricLabel(type: string): string {
  const lower = type?.toLowerCase() || '';
  if (lower.includes('face')) return 'Face ID';
  if (lower.includes('finger') || lower.includes('touch')) return 'digital';
  return 'biometria';
}
