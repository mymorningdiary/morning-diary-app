import { authInstance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';

export const deleteDiary = async (diaryId: number): Promise<ApiResponse<null>> => {
  const response = await authInstance.delete(`/diaries/${diaryId}`);
  return response.data;
};
