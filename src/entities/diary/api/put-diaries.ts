import { authInstance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';

interface PutDiariesRequest {
  diaryId: number;
  writtenDate: string;
  content: string;
}

interface PutDiariesResponse {
  diaryId: number;
}

export const putDiaries = async ({
  diaryId,
  writtenDate,
  content,
}: PutDiariesRequest): Promise<ApiResponse<PutDiariesResponse>> => {
  const response = await authInstance.put(`/diaries/${diaryId}`, { writtenDate, content });
  return response.data;
};
