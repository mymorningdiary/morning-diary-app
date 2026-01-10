import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import analytics from '@react-native-firebase/analytics';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppRouter } from '@application/routes';
import { Logger } from '@shared/lib/log';
import {
  getPushToken,
  registerNotificationListeners,
  setupNotificationChannel,
  useNotificationStore,
} from '@shared/lib/notifications';
import { MDDarkTheme, MDLightTheme } from '@shared/lib/theme';
import { SplashController } from './SplashController';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const queryClient = new QueryClient();

export function AppEntry() {
  const colorScheme = useColorScheme();

  // Kakao SDK 초기화
  useEffect(() => {
    const kakaoAppKey = process.env.EXPO_PUBLIC_KAKAO_APP_KEY;
    if (kakaoAppKey) {
      initializeKakaoSDK(kakaoAppKey);
    }
  }, []);

  // Firebase Analytics 초기화
  useEffect(() => {
    async function initializeAnalytics() {
      try {
        await analytics().setAnalyticsCollectionEnabled(true);
        Logger('AppEntry').debug('Success to initialize firebase analytics');
      } catch (error) {
        Logger('AppEntry').warn('Failed to initialize firebase analytics', error);
      }
    }

    initializeAnalytics();
  }, []);

  // Notification 초기화
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const init = async () => {
      await setupNotificationChannel();

      const token = await getPushToken();
      useNotificationStore.getState().setPushToken(token);

      cleanup = registerNotificationListeners({
        onReceive: (n) => useNotificationStore.getState().setNotification(n),
        onResponse: (r) => {
          Logger('Notification').debug('🔔 Notification Response', r);
        },
      });
    };

    init();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? MDDarkTheme : MDLightTheme}>
      <QueryClientProvider client={queryClient}>
        <SplashController />
        <AppRouter />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
