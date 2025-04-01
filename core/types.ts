import { Nullable } from '@/types/types';

export type SessionInfo = {
  accessToken?: Nullable<string>;
  refreshToken?: Nullable<string>;
  expiredAt?: Nullable<number>;
};

export type User = {
  goalPage: number;
  alarmTime: string;
};

export type Auth = {
  token: string;
  isExistUser: boolean;
};
