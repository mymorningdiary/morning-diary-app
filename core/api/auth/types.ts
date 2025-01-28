import { BaseApiResponse } from '@/core/api/types';

export type PostKakaoLoginRequest = {
  accessToken: string;
};

export type PostKakaoLoginResponse = BaseApiResponse & {
  data: {
    token: string;
    goalPage: number;
    alarmTime: string;
    flag: boolean;
  };
};
