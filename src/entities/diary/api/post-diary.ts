import { authInstance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';

interface PostDiariesRequest {
  writtenDate: string;
  content: string;
}

export interface PostDiariesResponse {
  diaryId: number;
  isFirstWrittenDiary: boolean;
  textLength: number;
}

export const postDiaries = async (
  body: PostDiariesRequest,
): Promise<ApiResponse<PostDiariesResponse>> => {
  const response = await authInstance.post('/diaries', body);
  return response.data;
};
