import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCountdownOptions {
  initialSeconds: number;
  autoStart?: boolean;
  onEnd?: () => void;
}

export function useCountdown({ initialSeconds, autoStart = false, onEnd }: UseCountdownOptions) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onEndRef = useRef(onEnd);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const tick = useCallback(() => {
    setSeconds((prev) => {
      if (prev <= 1) {
        stopTimer();
        onEndRef.current?.();
        return 0;
      }
      return prev - 1;
    });
  }, [stopTimer]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    if (seconds <= 0) {
      setSeconds(initialSeconds);
    }
    intervalRef.current = setInterval(tick, 1000);
    setIsRunning(true);
  }, [initialSeconds, seconds, tick]);

  const resetTimer = useCallback(
    (nextSeconds?: number) => {
      stopTimer();
      setSeconds(typeof nextSeconds === 'number' ? nextSeconds : initialSeconds);
    },
    [initialSeconds, stopTimer],
  );

  useEffect(() => {
    if (!autoStart) return;
    resetTimer(initialSeconds);
    startTimer();

    return stopTimer;
  }, [autoStart, initialSeconds, resetTimer, startTimer, stopTimer]);

  useEffect(() => stopTimer, [stopTimer]);

  return {
    seconds,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
  };
}
