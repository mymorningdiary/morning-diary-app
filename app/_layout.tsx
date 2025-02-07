import { MDDarkTheme } from '@/constants/theme';
import { MDLightTheme } from '@/constants/theme';
import { ThemeProvider } from '@react-navigation/native';
import { router, SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { ScreenName } from '@/constants/utils';

const queryClient = new QueryClient();
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { autoLogin, isAutoLoginLoading, nextScreen } = useAuth();

  useEffect(() => {
    setTimeout(() => {
      autoLogin();
    }, 1500);
  }, [autoLogin]);

  useEffect(() => {
    if (!isAutoLoginLoading && nextScreen !== null) {
      SplashScreen.hideAsync();

      switch (nextScreen) {
        case ScreenName.ONBOARDING:
          router.push('/onboarding');
          break;
        case ScreenName.MAIN:
          router.push('/main');
          break;
        case ScreenName.LOGIN:
          router.push('/login');
          break;
      }
    }
  }, [isAutoLoginLoading, nextScreen]);

  useEffect(() => {
    initializeKakaoSDK('162f6841f726fc6ff11498b56b4030aa'); // TODO: 환경변수 설정
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? MDDarkTheme : MDLightTheme}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" options={{ headerShown: true }} />
          <Stack.Screen name="main" options={{ headerShown: true }} />
          <Stack.Screen name="onboarding" options={{ headerShown: true }} />
        </Stack>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
