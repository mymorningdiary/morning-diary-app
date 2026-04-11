import { authInstance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';
import { Diary } from '../model/types';

interface GetDiariesResponse {
  diaryInfos: Diary[];
}

export const getDiaries = async (date: string): Promise<ApiResponse<GetDiariesResponse>> => {
  const response = await authInstance.get(`/diaries?date=${date}`);
  return response.data;
};
