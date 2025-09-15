import { SplashScreen } from 'expo-router';
import { useAppState } from '../contexts/AppStateContext';

export function SplashScreenController() {
  const { isLoading } = useAppState();

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}
