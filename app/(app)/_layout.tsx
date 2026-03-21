import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="diary-list" />
      <Stack.Screen name="write-diary" />
      <Stack.Screen name="update-diary" />
      <Stack.Screen name="read-diary" />
      <Stack.Screen name="first-write" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="account" />
      <Stack.Screen name="text-goal" />
      <Stack.Screen name="withdraw" />
      <Stack.Screen name="alarm-time" />
      <Stack.Screen name="alarm-permission" />
      <Stack.Screen name="diary-write" />
      <Stack.Screen name="diary-first" />
      <Stack.Screen name="diary-read" />
    </Stack>
  );
}
