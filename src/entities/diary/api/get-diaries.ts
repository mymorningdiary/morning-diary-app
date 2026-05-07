import { authInstance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';
import { WeeklyDiaries } from '../model/types';

interface GetDiariesResponse {
  weeks: WeeklyDiaries[];
}

export const getDiaries = async (date: string): Promise<ApiResponse<GetDiariesResponse>> => {
  const response = await authInstance.get(`/v2/diaries?date=${date}`);
  return response.data;
};
