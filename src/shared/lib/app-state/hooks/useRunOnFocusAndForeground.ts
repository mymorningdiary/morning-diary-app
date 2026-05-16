import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

import { useForeground } from './useForeground';

interface Options {
  skipInitialFocus?: boolean;
  dedupeIntervalMs?: number;
}

export function useRunOnFocusAndForeground(callback: () => void, options: Options = {}) {
  const { skipInitialFocus = true, dedupeIntervalMs = 500 } = options;
  const isFocusedRef = useRef(false);
  const hasFocusedOnceRef = useRef(false);
  const lastCalledAtRef = useRef(0);

  const run = useCallback(() => {
    const now = Date.now();

    if (now - lastCalledAtRef.current < dedupeIntervalMs) return;

    lastCalledAtRef.current = now;
    callback();
  }, [callback, dedupeIntervalMs]);

  useFocusEffect(
    useCallback(() => {
      isFocusedRef.current = true;

      if (skipInitialFocus && !hasFocusedOnceRef.current) {
        hasFocusedOnceRef.current = true;
        return () => {
          isFocusedRef.current = false;
        };
      }

      run();

      return () => {
        isFocusedRef.current = false;
      };
    }, [run, skipInitialFocus]),
  );

  useForeground(
    useCallback(() => {
      if (!isFocusedRef.current) return;

      run();
    }, [run]),
  );
}
