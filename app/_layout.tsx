import { MDDarkTheme } from '@/constants/theme';
import { MDLightTheme } from '@/constants/theme';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? MDDarkTheme : MDLightTheme}>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="detail" options={{ headerShown: true }} />
      </Stack>
    </ThemeProvider>
  );
}
