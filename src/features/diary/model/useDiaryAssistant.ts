import { useState } from 'react';
import { AssistantState } from './types';

export function useDiaryAssistant() {
  const [assistantState, setAssistantState] = useState<AssistantState>({
    show: false,
    message: '',
    version: 0,
  });

  const showAssistant = (message: string) => {
    setAssistantState((prev) => ({
      show: true,
      message,
      version: prev.version + 1,
    }));
  };

  const hideAssistant = () => {
    setAssistantState((prev) => ({
      ...prev,
      show: false,
    }));
  };

  return {
    assistantState,
    showAssistant,
    hideAssistant,
  };
}
