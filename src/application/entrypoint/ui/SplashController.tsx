import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';

import { useSession } from '@application/providers/SessionProvider';
import { useVisited } from '@features/onboarding';

export function SplashController() {
  const { isLoading: isSessionLoading } = useSession();
  const { isLoading: isVisitedLoading } = useVisited();

  const isReady = !isSessionLoading && !isVisitedLoading;

  useEffect(() => {
    void SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    if (isReady) {
      void SplashScreen.hideAsync();
    }
  }, [isReady]);

  return null;
}
