import { useEffect, useState } from 'react';
import { DiaryState } from './types';
import { INACTIVE_TEXT_LEN } from '../config/constants';
import { DEFAULT_TEXT_GOAL_LEN } from '@entities/text-goal';

interface Options {
  initialText?: string;
  textGoalLen?: number;
}

export function useDiaryEditor({ initialText = '', textGoalLen = DEFAULT_TEXT_GOAL_LEN }: Options) {
  const [state, setState] = useState<DiaryState>({
    inactiveText: '',
    activeText: '',
    version: 0,
  });

  const currentTextLen = state.inactiveText.length + state.activeText.length;
  const progress = Math.min(100, Math.floor((currentTextLen / textGoalLen) * 100));

  const inactivateText = (value: string) => {
    const inactiveTextLen = Math.floor((value.length - 1) / INACTIVE_TEXT_LEN) * INACTIVE_TEXT_LEN;

    setState((prev) => ({
      inactiveText: prev.inactiveText + value.slice(0, inactiveTextLen),
      activeText: value.slice(inactiveTextLen),
      version: prev.version + 1,
    }));
  };

  const handleDiaryTextChange = (value: string) => {
    if (value.length <= INACTIVE_TEXT_LEN) {
      setState((prev) => ({ ...prev, activeText: value }));
      return;
    }

    inactivateText(value);
  };

  useEffect(() => {
    if (initialText == null) return;

    setState({
      inactiveText: initialText,
      activeText: '',
      version: 0,
    });
  }, [initialText]);

  return {
    diaryState: state,
    currentTextLen,
    progress,
    handleDiaryTextChange,
  };
}
