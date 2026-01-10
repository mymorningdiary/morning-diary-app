import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';

import { useVisited } from '@features/onboarding';
import { useAuthStore } from '@shared/lib/auth';

export function SplashController() {
  const isAuthLoaded = useAuthStore((s) => s.isAuthLoaded);
  const { isLoading: isVisitedLoading } = useVisited();

  const isReady = !isAuthLoaded && !isVisitedLoading;

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
