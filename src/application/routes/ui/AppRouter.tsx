import { Logger } from '@/utils/logs';
import { useVisited } from '@features/onboarding';
import { MDToast } from '@shared/ui/MDToast';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useSession } from '../../providers/SessionProvider';

export function AppRouter() {
  const { session, isLoading: isSessionLoading } = useSession();
  const { isFirstVisit, isLoading: isVisitedLoading } = useVisited();
  const isLoading = isSessionLoading || isVisitedLoading || isFirstVisit === null;

  useEffect(() => {
    Logger('AppRouter').debug('session:', session, 'isFirstVisit:', isFirstVisit);
  }, [session, isFirstVisit]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isFirstVisit === true}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>

        <Stack.Protected guard={!session && isFirstVisit === false}>
          <Stack.Screen name="login" />
          <Stack.Screen name="sign-in-email" />
          <Stack.Screen name="sign-up" />
        </Stack.Protected>

        <Stack.Protected guard={!!session && isFirstVisit === false}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>

        <Stack.Screen name="web-view" />
      </Stack>
      <MDToast />
    </>
  );
}
