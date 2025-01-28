import { MDDarkTheme } from '@/constants/theme';
import { MDLightTheme } from '@/constants/theme';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { getKeyHashAndroid } from '@react-native-kakao/core';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    getKeyHashAndroid().then(console.log);
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? MDDarkTheme : MDLightTheme}>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="detail" options={{ headerShown: true }} />
        <Stack.Screen name="login" options={{ headerShown: true }} />
      </Stack>
    </ThemeProvider>
  );
}
