export interface DiaryState {
  inactiveText: string;
  activeText: string;
  version: number;
}

export interface AssistantState {
  show: boolean;
  message: string;
  version: number;
}
