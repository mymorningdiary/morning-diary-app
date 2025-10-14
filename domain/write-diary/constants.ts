import {
  ASSISTANT_GOAL_10_MESSAGES,
  ASSISTANT_GOAL_50_MESSAGES,
  ASSISTANT_GOAL_90_MESSAGES,
} from '@/constants/messages';

export const INACTIVE_TEXT_LEN = 50;
export const INACTIVATE_TEXT_TIME = 1500;
export const INACTIVE_INPUT_TIME = 5000;
export const ASSISTANT_SHOW_TIME = 5000;

export const PROGRESS_MESSAGES = {
  10: ASSISTANT_GOAL_10_MESSAGES,
  50: ASSISTANT_GOAL_50_MESSAGES,
  90: ASSISTANT_GOAL_90_MESSAGES,
} satisfies Record<number, string[]>;

export type ProgressKey = keyof typeof PROGRESS_MESSAGES;
