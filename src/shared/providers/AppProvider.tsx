import * as Notifications from 'expo-notifications';
import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { PropsWithChildren, useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { initializeKakaoSDK } from '@react-native-kakao/core';

import firebase from '@shared/lib/firebase';
import { Logger } from '@shared/lib/log';
import {
  getPushToken,
  registerNotificationListeners,
  setupNotificationChannel,
  useNotificationStore,
} from '@shared/lib/notifications';
import { MDDarkTheme, MDLightTheme } from '@shared/lib/theme';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

dayjs.locale('ko');

const queryClient = new QueryClient();

export function AppProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();

  useReactQueryDevTools(queryClient);

  useEffect(() => {
    const kakaoAppKey = process.env.EXPO_PUBLIC_KAKAO_APP_KEY;
    if (kakaoAppKey) {
      initializeKakaoSDK(kakaoAppKey);
    }
  }, []);

  useEffect(() => {
    async function initializeAnalytics() {
      try {
        await firebase.analytics().setAnalyticsCollectionEnabled(true);
        Logger('AppProvider').debug('Success to initialize firebase analytics');
      } catch (error) {
        Logger('AppProvider').warn('Failed to initialize firebase analytics', error);
      }
    }

    void initializeAnalytics();
  }, []);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const init = async () => {
      await setupNotificationChannel();

      const token = await getPushToken();
      useNotificationStore.getState().setPushToken(token);

      cleanup = registerNotificationListeners({
        onReceive: (notification) => useNotificationStore.getState().setNotification(notification),
        onResponse: (response) => {
          Logger('Notification').debug('🔔 Notification Response', response);
        },
      });
    };

    void init();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? MDDarkTheme : MDLightTheme}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
