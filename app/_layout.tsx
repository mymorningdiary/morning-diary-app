import { MDDarkTheme } from '@/constants/theme';
import { MDLightTheme } from '@/constants/theme';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

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
