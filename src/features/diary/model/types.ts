import { ASSISTANT_PROGRESS_MESSAGES } from '../config/constants';

export interface DiaryState {
  inactiveText: string;
  activeText: string;
  version: number;
}

export interface AssistantState {
  show: boolean;
  image?: string;
  message: string;
  version: number;
}

export type DiaryProgressKey = keyof typeof ASSISTANT_PROGRESS_MESSAGES;
