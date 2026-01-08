import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SplashScreen } from 'expo-router';
import * as Notifications from 'expo-notifications';

import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { initializeKakaoSDK } from '@react-native-kakao/core';
import analytics from '@react-native-firebase/analytics';

import { NotificationProvider } from '@/contexts/NotificationContext';

import { MDDarkTheme, MDLightTheme } from '@shared/lib/theme';
import { Logger } from '@shared/lib/log';
import { SessionProvider } from '@application/providers/SessionProvider';
import { AppRouter } from '@application/routes';
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

  useEffect(() => {
    void SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    const kakaoAppKey = process.env.EXPO_PUBLIC_KAKAO_APP_KEY;
    if (kakaoAppKey) {
      initializeKakaoSDK(kakaoAppKey);
    }
  }, []);

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

  return (
    <ThemeProvider value={colorScheme === 'dark' ? MDDarkTheme : MDLightTheme}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <NotificationProvider>
            <SplashController />
            <AppRouter />
          </NotificationProvider>
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
