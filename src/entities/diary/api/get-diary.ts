import { authInstance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';
import { Diary } from '../model/types';

export const getDiary = async (diaryId: number): Promise<ApiResponse<Diary>> => {
  const response = await authInstance.get(`/diaries/${diaryId}`);
  return response.data;
};
