import { useEffect, useState } from 'react';

import { Logger } from '@shared/lib/log';
import {
  AssistantOn,
  getAssistantOn,
  setAssistantOn as saveAssistantOn,
} from './assistantOnStorage';

export function useAssistantOn() {
  const [assistantOn, setAssistantOnState] = useState<AssistantOn>('Y');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadAssistantOn = async () => {
      try {
        const storedAssistantOn = await getAssistantOn();

        if (isMounted) {
          setAssistantOnState(storedAssistantOn);
        }
      } catch (error) {
        Logger('useAssistantOn').error('Failed to load assistantOn', error);
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    };

    void loadAssistantOn();

    return () => {
      isMounted = false;
    };
  }, []);

  const setAssistantOn = async (nextAssistantOn: AssistantOn) => {
    setAssistantOnState(nextAssistantOn);

    try {
      await saveAssistantOn(nextAssistantOn);
    } catch (error) {
      Logger('useAssistantOn').error('Failed to save assistantOn', error);
    }
  };

  return {
    assistantOn,
    isLoaded,
    setAssistantOn,
  };
}
