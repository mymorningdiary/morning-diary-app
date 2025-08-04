import { MDDarkTheme, MDLightTheme } from '@/constants/theme';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserProvider } from '@/contexts/UserContext';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    initializeKakaoSDK('162f6841f726fc6ff11498b56b4030aa'); // TODO: 환경변수 설정
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? MDDarkTheme : MDLightTheme}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <AuthProvider>
            <UserProvider>
              <Stack>
                <Stack.Screen name="index" />
                <Stack.Screen name="login" options={{ headerShown: true }} />
                <Stack.Screen name="main" options={{ headerShown: true }} />
                <Stack.Screen name="onboarding" options={{ headerShown: true }} />
                <Stack.Screen name="write" options={{ headerShown: true }} />
                <Stack.Screen name="first-write" options={{ headerShown: true }} />
                <Stack.Screen name="read-diary" options={{ headerShown: true }} />
                <Stack.Screen name="update-diary" options={{ headerShown: true }} />
                <Stack.Screen name="text-goal" options={{ headerShown: true }} />
                <Stack.Screen name="setting" options={{ headerShown: true }} />
                <Stack.Screen name="account" options={{ headerShown: true }} />
                <Stack.Screen name="(notification)" options={{ headerShown: true }} />
              </Stack>
            </UserProvider>
          </AuthProvider>
        </AppProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
