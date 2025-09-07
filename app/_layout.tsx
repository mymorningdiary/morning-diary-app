import { MDDarkTheme, MDLightTheme } from '@/constants/theme';
import { AppStateProvider, useAppState } from '@/contexts/AppContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { SplashScreenController } from '@/core/splash';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    initializeKakaoSDK('a243e903ae144e0e7d383fc00ef39d21'); // TODO: 환경변수 설정
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? MDDarkTheme : MDLightTheme}>
      <QueryClientProvider client={queryClient}>
        <AppStateProvider>
          <NotificationProvider>
            <SplashScreenController />
            <RootNavigator />
          </NotificationProvider>
        </AppStateProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { session, hasVisited, isLoading } = useAppState();

  useEffect(() => {
    console.log('[RootNavigator] session:', session, 'hasVisited:', hasVisited);
  }, [session, hasVisited]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!session && hasVisited === null}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!session && hasVisited === 'true'}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}