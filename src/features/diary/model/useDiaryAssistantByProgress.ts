import { useEffect, useRef, useState } from 'react';

import { getRandomMessage } from '@shared/lib/random';
import { ASSISTANT_PROGRESS_MESSAGES } from '../config/constants';
import { DiaryProgressKey } from './types';

interface Options {
  progress: number;
  showAssistant: (message: string) => void;
}

export function useDiaryAssistantByProgress({ progress, showAssistant }: Options) {
  const prevProgressRef = useRef(0);
  const [shownProgress, setShownProgress] = useState<Record<DiaryProgressKey, boolean>>({
    10: false,
    50: false,
    90: false,
  });

  useEffect(() => {
    const prevProgress = prevProgressRef.current;

    const showAssistantByProgress = (key: DiaryProgressKey) => {
      if (shownProgress[key]) {
        return;
      }

      showAssistant(getRandomMessage(ASSISTANT_PROGRESS_MESSAGES[key]));
      setShownProgress((prev) => ({ ...prev, [key]: true }));
    };

    if (prevProgress < 10 && progress >= 10) {
      showAssistantByProgress(10);
    } else if (prevProgress < 50 && progress >= 50) {
      showAssistantByProgress(50);
    } else if (prevProgress < 90 && progress >= 90) {
      showAssistantByProgress(90);
    }

    prevProgressRef.current = progress;
  }, [progress, shownProgress, showAssistant]);
}
