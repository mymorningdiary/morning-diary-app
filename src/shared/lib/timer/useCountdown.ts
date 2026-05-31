import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

interface UseCountdownOptions {
  initialSeconds: number;
  autoStart?: boolean;
  onEnd?: () => void;
}

export function useCountdown({ initialSeconds, autoStart = false, onEnd }: UseCountdownOptions) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const deadlineRef = useRef<number | null>(null);
  const secondsRef = useRef(initialSeconds);
  const onEndRef = useRef(onEnd);
  const hasEndedRef = useRef(false);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const setRemainingSeconds = useCallback((nextSeconds: number) => {
    secondsRef.current = nextSeconds;
    setSeconds(nextSeconds);
  }, []);

  const finishTimer = useCallback(() => {
    clearTimer();
    deadlineRef.current = null;
    setRemainingSeconds(0);
    setIsRunning(false);
    if (!hasEndedRef.current) {
      hasEndedRef.current = true;
      onEndRef.current?.();
    }
  }, [clearTimer, setRemainingSeconds]);

  const syncRemainingSeconds = useCallback(() => {
    if (!deadlineRef.current) return;

    const nextSeconds = Math.max(Math.ceil((deadlineRef.current - Date.now()) / 1000), 0);

    if (nextSeconds <= 0) {
      finishTimer();
      return;
    }

    setRemainingSeconds(nextSeconds);
  }, [finishTimer, setRemainingSeconds]);

  const stopTimer = useCallback(() => {
    clearTimer();
    deadlineRef.current = null;
    setIsRunning(false);
  }, [clearTimer]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;

    const nextSeconds = secondsRef.current <= 0 ? initialSeconds : secondsRef.current;
    deadlineRef.current = Date.now() + nextSeconds * 1000;
    hasEndedRef.current = false;
    setRemainingSeconds(nextSeconds);
    intervalRef.current = setInterval(syncRemainingSeconds, 1000);
    setIsRunning(true);
    syncRemainingSeconds();
  }, [initialSeconds, setRemainingSeconds, syncRemainingSeconds]);

  const resetTimer = useCallback(
    (nextSeconds?: number) => {
      clearTimer();
      deadlineRef.current = null;
      hasEndedRef.current = false;
      setIsRunning(false);
      setRemainingSeconds(typeof nextSeconds === 'number' ? nextSeconds : initialSeconds);
    },
    [clearTimer, initialSeconds, setRemainingSeconds],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && isRunning) {
        syncRemainingSeconds();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isRunning, syncRemainingSeconds]);

  useEffect(() => {
    if (!autoStart) return;
    resetTimer(initialSeconds);
    startTimer();

    return stopTimer;
  }, [autoStart, initialSeconds, resetTimer, startTimer, stopTimer]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    seconds,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
  };
}
