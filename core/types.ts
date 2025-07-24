import { Nullable } from '@/types/types';

export type SessionInfo = {
  accessToken?: Nullable<string>;
  refreshToken?: Nullable<string>;
  expiredAt?: Nullable<number>;
};

export type User = {
  alarmTime: string;
  textGoalId: number;
};

export type Auth = {
  token: string;
  isExistUser: boolean;
};

export type Diary = {
  diaryId: number;
  writtenDate: string;
  dayOfWeek: string;
  previewContent: string;
  content: string;
};

export type Diaries = {
  days: number[];
  diaryInfos: Diary[];
};

export type TextGoal = {
  textGoalId: number;
  title: string;
  textLength: number;
  option: string;
  isDefault: boolean;
  isUserTextGoal: boolean;
};
