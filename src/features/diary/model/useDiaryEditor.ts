import { useState } from 'react';
import { DiaryState } from './types';
import { INACTIVE_TEXT_LEN } from '../config/constants';

export function useDiaryEditor(initialText = '') {
  const [state, setState] = useState<DiaryState>({
    inactiveText: initialText.slice(0, Math.max(0, initialText.length - INACTIVE_TEXT_LEN)),
    activeText: initialText.slice(Math.max(0, initialText.length - INACTIVE_TEXT_LEN)),
    version: 0,
  });

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
    handleDiaryTextChange,
  };
}
