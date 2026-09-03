import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vatsakrish.rungs',
  appName: 'Rungs',
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
