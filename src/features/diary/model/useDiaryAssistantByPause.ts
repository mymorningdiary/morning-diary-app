import { useEffect, useRef } from 'react';

import { getRandomMessage } from '@shared/lib/random';
import { ASSISTANT_PAUSE_MESSAGES } from '../lib/diary-messages';

const PAUSE_MS = 5_000;

interface Options {
  currentTextLen: number;
  showAssistant: (message: string) => void;
}

export function useDiaryAssistantByPause({ currentTextLen, showAssistant }: Options) {
  const pauseTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const isFirstRenderRef = useRef(true);

  const clearPauseTimer = () => {
    if (pauseTimer.current) {
      clearTimeout(pauseTimer.current);
      pauseTimer.current = null;
    }
  };

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    clearPauseTimer();

    if (currentTextLen == 0) {
      return;
    }

    pauseTimer.current = setTimeout(() => {
      showAssistant(getRandomMessage(ASSISTANT_PAUSE_MESSAGES));
    }, PAUSE_MS);

    return clearPauseTimer;
  }, [currentTextLen]);
}
