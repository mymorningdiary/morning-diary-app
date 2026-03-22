import { useEffect } from 'react';
import { AppState } from 'react-native';

export function useForeground(callback: () => void) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        callback();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [callback]);
}
