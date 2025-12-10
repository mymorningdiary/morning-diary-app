import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export const useOnForeground = (callback: () => void) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (/inactive|background/.test(appState.current) && next === 'active') {
        callback();
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, [callback]);
};
