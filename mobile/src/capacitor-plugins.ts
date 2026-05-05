/**
 * Capacitor Native Plugins Integration
 *
 * Import this file in your React app's main.tsx to enable native features
 */

import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

/**
 * Initialize native plugins
 * Call this function when your app starts
 */
export async function initializeNativePlugins() {
  // Only run on native platforms
  if (!Capacitor.isNativePlatform()) {
    console.log('Running on web - skipping native plugin initialization');
    return;
  }

  try {
    // Configure Status Bar
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#16a34a' }); // green-600

    // Hide splash screen after app is ready
    await SplashScreen.hide();

    console.log('Native plugins initialized successfully');
  } catch (error) {
    console.error('Error initializing native plugins:', error);
  }
}

/**
 * Check if running on native platform
 */
export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

/**
 * Get current platform
 */
export function getPlatform(): 'ios' | 'android' | 'web' {
  return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
}
