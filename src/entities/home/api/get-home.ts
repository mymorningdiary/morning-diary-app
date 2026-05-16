import { authInstance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';

import { Diary } from '../../diary/model/types';

interface GetHomeResponse {
  diaries: Diary[];
  weeklyAverageEmotionScore: number;
  hasWrittenDiaryThisWeek: boolean;
  weeklyDiaryCount: number;
  reportId: number | null;
}

export const getHome = async (date: string): Promise<ApiResponse<GetHomeResponse>> => {
  const response = await authInstance.get(`/home?date=${date}`);
  return response.data;
};
