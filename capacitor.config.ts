import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vatsakrish.hundred',
  appName: 'Hundred',
  webDir: 'dist',
  backgroundColor: '#161826',
  android: {
    backgroundColor: '#161826',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#161826',
      androidSplashResourceName: 'splash',
    },
  },
};

export default config;
