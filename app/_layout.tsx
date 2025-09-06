import { MDDarkTheme, MDLightTheme } from '@/constants/theme';
import { AppProvider } from '@/contexts/AppContext';
import { SessionProvider, useSession } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { UserProvider } from '@/contexts/UserContext';
import { SplashScreenController } from '@/splash';
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
        <AppProvider>
          <NotificationProvider>
            <SessionProvider>
                <SplashScreenController />
                <RootNavigator />
            </SessionProvider>
          </NotificationProvider>
        </AppProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { session } = useSession();

  return (
    <Stack>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name='onboarding' />
      </Stack.Protected>
    </Stack>
  );
}