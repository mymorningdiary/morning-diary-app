
import { UserProvider } from '@/contexts/UserContext';
import { Stack } from 'expo-router';

export default function AppLayout() {

  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="main" options={{ headerShown: true }} />
        <Stack.Screen name="write-diary" options={{ headerShown: true }} />
        <Stack.Screen name="update-diary" options={{ headerShown: true }} />
        <Stack.Screen name="read-diary" options={{ headerShown: true }} />
        <Stack.Screen name="first-write" options={{ headerShown: true }} />
        <Stack.Screen name="settings" options={{ headerShown: true }} />
        <Stack.Screen name="account" options={{ headerShown: true }} />
        <Stack.Screen name="text-goal" options={{ headerShown: true }} />
        <Stack.Screen name="(notification)" options={{ headerShown: true }} />
      </Stack>
    </UserProvider>
  );
}
