import { SplashScreen } from 'expo-router';
import { useSession } from './contexts/AuthContext';
import { useEffect } from 'react';


export function SplashScreenController() {
  const { isLoading, session } = useSession();

  useEffect(() => {
    console.log('[SplashScreenController] isLoading', isLoading, 'session', session);
  }, [isLoading, session])

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}
