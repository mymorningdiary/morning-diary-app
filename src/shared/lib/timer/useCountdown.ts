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

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const tick = useCallback(() => {
    setSeconds((prev) => {
      if (prev <= 1) {
        stop();
        onEndRef.current?.();
        return 0;
      }
      return prev - 1;
    });
  }, [stop]);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    if (seconds <= 0) {
      setSeconds(initialSeconds);
    }
    intervalRef.current = setInterval(tick, 1000);
    setIsRunning(true);
  }, [initialSeconds, seconds, tick]);

  const reset = useCallback(
    (nextSeconds?: number) => {
      stop();
      setSeconds(typeof nextSeconds === 'number' ? nextSeconds : initialSeconds);
    },
    [initialSeconds, stop],
  );

  useEffect(() => {
    if (!autoStart) return;
    reset(initialSeconds);
    start();
    return stop;
  }, [autoStart, initialSeconds, reset, start, stop]);

  useEffect(() => stop, [stop]);

  return {
    seconds,
    isRunning,
    start,
    stop,
    reset,
  };
}
