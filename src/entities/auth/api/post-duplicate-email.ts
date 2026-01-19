import { instance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';

interface DuplicateEmailRequest {
  email: string;
}

export const postDuplicateEmail = async (
  body: DuplicateEmailRequest,
): Promise<ApiResponse<null>> => {
  const response = await instance.post('/auth/duplicate-email', body);
  return response.data;
};
