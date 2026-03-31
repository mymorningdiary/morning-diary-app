import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(main)" />
      <Stack.Screen name="account" />
      <Stack.Screen name="text-goal" />
      <Stack.Screen name="withdraw" />
      <Stack.Screen name="diary-write" />
      <Stack.Screen name="diary-first" />
      <Stack.Screen name="diary-read" />
      <Stack.Screen name="diary-update" />
      <Stack.Screen name="notification" />
    </Stack>
  );
}
