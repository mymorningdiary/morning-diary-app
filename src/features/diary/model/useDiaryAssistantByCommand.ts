import { useEffect, useRef } from 'react';

import { getDiaryAssistantCommandMessage } from '../lib/assistant-command-messages';

interface Options {
  text: string;
  showAssistant: (message: string) => void;
}

export function useDiaryAssistantByCommand({ text, showAssistant }: Options) {
  const lastTriggeredCommandRef = useRef<string | null>(null);

  useEffect(() => {
    const command = getLastAssistantCommand(text);
    if (!command) {
      lastTriggeredCommandRef.current = null;
      return;
    }

    const message = getDiaryAssistantCommandMessage(command);
    if (!message || lastTriggeredCommandRef.current === command) {
      return;
    }

    lastTriggeredCommandRef.current = command;
    showAssistant(message);
  }, [showAssistant, text]);
}

function getLastAssistantCommand(text: string) {
  const commands = text.match(/@[^\s@]+/g);
  return commands?.[commands.length - 1] ?? null;
}
