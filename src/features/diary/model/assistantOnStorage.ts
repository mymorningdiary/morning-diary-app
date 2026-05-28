import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export type AssistantOn = 'Y' | 'N';

const ASSISTANT_ON_STORAGE_KEY = 'diary-assistant-on';
const DEFAULT_ASSISTANT_ON: AssistantOn = 'Y';

function isAssistantOn(value: string | null): value is AssistantOn {
  return value === 'Y' || value === 'N';
}

export async function getAssistantOn(): Promise<AssistantOn> {
  const value =
    Platform.OS === 'web'
      ? localStorage.getItem(ASSISTANT_ON_STORAGE_KEY)
      : await AsyncStorage.getItem(ASSISTANT_ON_STORAGE_KEY);

  return isAssistantOn(value) ? value : DEFAULT_ASSISTANT_ON;
}

export async function setAssistantOn(assistantOn: AssistantOn) {
  if (Platform.OS === 'web') {
    localStorage.setItem(ASSISTANT_ON_STORAGE_KEY, assistantOn);
    return;
  }

  await AsyncStorage.setItem(ASSISTANT_ON_STORAGE_KEY, assistantOn);
}
