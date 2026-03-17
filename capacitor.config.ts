import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.yookieplay',
  appName: 'YookiePlay',
  webDir: 'dist',
  server: {
    url: 'https://8274ad98-eeed-4be6-b043-e2ae305efc55.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
