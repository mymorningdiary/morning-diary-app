
import { UserProvider } from '@/contexts/UserContext';
import { Stack } from 'expo-router';

export default function AppLayout() {

  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="write-diary" options={{ headerShown: false }} />
        <Stack.Screen name="update-diary" options={{ headerShown: false }} />
        <Stack.Screen name="read-diary" options={{ headerShown: false }} />
        <Stack.Screen name="first-write" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="account" options={{ headerShown: false }} />
        <Stack.Screen name="text-goal" options={{ headerShown: false }} />
        <Stack.Screen name="(notification)" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
