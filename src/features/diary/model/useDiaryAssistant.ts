import { useState } from 'react';
import { AssistantState } from './types';

export function useDiaryAssistant() {
  const [assistantState, setAssistantState] = useState<AssistantState>({
    show: false,
    message: '',
    version: 0,
  });

  const handleShowAssistant = (message: string) => {
    setAssistantState((prev) => ({
      show: true,
      message,
      version: prev.version + 1,
    }));
  };

  const handleHideAssistant = () => {
    setAssistantState((prev) => ({
      ...prev,
      show: false,
    }));
  };

  return {
    assistantState,
    handleShowAssistant,
    handleHideAssistant,
  };
}
