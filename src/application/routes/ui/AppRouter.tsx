import { Logger } from '@/utils/logs';
import { useAppVersion } from '@entities/version';
import { useVisited } from '@features/onboarding';
import { useAuthStore } from '@shared/lib/auth';

import { MDToast } from '@shared/ui/MDToast';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

export function AppRouter() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthLoaded = useAuthStore((s) => s.isAuthLoaded);
  const { isFirstVisit, isLoading: isVisitedLoading } = useVisited();
  const isLoading = !isAuthLoaded || isVisitedLoading || isFirstVisit === null;

  const { versionStatus } = useAppVersion();

  useEffect(() => {
    Logger('AppRouter').debug('isAuthLoaded:', isAuthLoaded, 'accessToken:', accessToken);
  }, [isAuthLoaded, accessToken]);

  useEffect(() => {
    Logger('AppRouter').debug('isFirstVisit:', isFirstVisit);
  }, [isFirstVisit]);

  if (isLoading) {
    return null;
  }

  if (versionStatus === 'ok') {
    return <></>;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isFirstVisit === true}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>

        <Stack.Protected guard={!accessToken && isFirstVisit === false}>
          <Stack.Screen name="login" />
          <Stack.Screen name="sign-in-email" />
          <Stack.Screen name="sign-up" />
        </Stack.Protected>

        <Stack.Protected guard={!!accessToken && isFirstVisit === false}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>

        <Stack.Screen name="web-view" />
      </Stack>
      <MDToast />
    </>
  );
}
