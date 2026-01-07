import { Logger } from '@/utils/logs';
import { MDToast } from '@shared/ui/MDToast';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useSession } from '../../providers/SessionProvider';

export function AppRouter() {
  const { session, isLoading } = useSession();

  useEffect(() => {
    Logger('AppRouter').debug('session:', session, 'hasVisited:');
  }, [session]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* <Stack.Protected guard={hasVisited === false}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected> */}

        <Stack.Protected guard={!session}>
          <Stack.Screen name="login" />
          <Stack.Screen name="sign-in-email" />
          <Stack.Screen name="sign-up" />
        </Stack.Protected>

        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>

        <Stack.Screen name="web-view" />
      </Stack>
      <MDToast />
    </>
  );
}
