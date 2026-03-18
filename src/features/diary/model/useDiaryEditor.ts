import { useState } from 'react';
import { DiaryState } from './types';
import { INACTIVE_TEXT_LEN } from '../config/constants';
import { DEFAULT_TEXT_GOAL_LEN } from '@entities/text-goal';

interface Options {
  initialText?: string;
  textGoalLen?: number;
}

export function useDiaryEditor({ initialText = '', textGoalLen = DEFAULT_TEXT_GOAL_LEN }: Options) {
  const [state, setState] = useState<DiaryState>({
    inactiveText: initialText.slice(0, Math.max(0, initialText.length - INACTIVE_TEXT_LEN)),
    activeText: initialText.slice(Math.max(0, initialText.length - INACTIVE_TEXT_LEN)),
    version: 0,
  });

  const currentTextLen = state.inactiveText.length + state.activeText.length;
  const progress = Math.floor((currentTextLen / textGoalLen) * 100);

  const inactivateText = (value: string) => {
    setState((prev) => ({
      inactiveText: prev.inactiveText + value.slice(0, INACTIVE_TEXT_LEN),
      activeText: value.slice(INACTIVE_TEXT_LEN),
      version: prev.version + 1,
    }));
  };

  const handleDiaryTextChange = (value: string) => {
    if (value.length < INACTIVE_TEXT_LEN) {
      setState((prev) => ({ ...prev, activeText: value }));
      return;
    }

    inactivateText(value);
  };

  return {
    diaryState: state,
    currentTextLen,
    progress,
    handleDiaryTextChange,
  };
}
