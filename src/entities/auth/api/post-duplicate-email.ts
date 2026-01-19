import { instance } from '@shared/api/client';
import { ApiResponse, Auth } from '@shared/api/types';

interface DuplicateEmailRequest {
  email: string;
}

export const postDuplicateEmail = async (
  body: DuplicateEmailRequest,
): Promise<ApiResponse<Auth>> => {
  const response = await instance.post('/auth/duplicate-email', body);
  return response.data;
};
