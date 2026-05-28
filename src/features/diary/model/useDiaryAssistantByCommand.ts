import { useEffect, useRef } from 'react';

import { getDiaryAssistantCommandMessage } from '../lib/assistant-command-messages';

interface Options {
  text: string;
  showAssistant: (message: string) => void;
  enabled?: boolean;
}

export function useDiaryAssistantByCommand({ text, showAssistant, enabled = true }: Options) {
  const lastTriggeredCommandRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      lastTriggeredCommandRef.current = null;
      return;
    }

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
  }, [enabled, showAssistant, text]);
}

function getLastAssistantCommand(text: string) {
  const commands = text.match(/@[^\s@]+/g);
  return commands?.[commands.length - 1] ?? null;
}
