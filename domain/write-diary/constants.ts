export const INACTIVE_TEXT_LEN = 50;
export const INACTIVATE_TEXT_TIME = 1500;
export const INACTIVE_INPUT_TIME = 5000;
export const ASSISTANT_SHOW_TIME = 3000;

export const PROGRESS_MESSAGES = {
  10: '잠든 생각들을 깨워봐요',
  50: '요즘 계속 생각나는 고민이나 생각들이 있나요?',
  90: '고지가 코앞이에요',
} as const;

export type ProgressKey = keyof typeof PROGRESS_MESSAGES;
