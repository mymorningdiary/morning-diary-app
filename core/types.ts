export type User = {
  alarmTime: string | null;
  textGoalId: number;
  email: string | null;
};

export type Auth = {
  accessToken: string;
  refreshToken: string;
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

export interface AppVersion {
  android: {
    version: string;
    minVersion: string;
  };
  ios: {
    version: string;
    minVersion: string;
  };
}
