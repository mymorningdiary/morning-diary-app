import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { useAppState } from '../contexts/AppContext';


export function SplashScreenController() {
  const { isLoading, session } = useAppState();

  useEffect(() => {
    console.log('[SplashScreenController] isLoading', isLoading, 'session', session);
  }, [isLoading, session])

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}
