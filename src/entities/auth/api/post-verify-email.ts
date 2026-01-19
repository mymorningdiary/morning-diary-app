import { instance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';

export interface VerifyEmailRequest {
  email: string;
  authenticationNumber: string;
}

export const postVerifyEmail = async (body: VerifyEmailRequest): Promise<ApiResponse<null>> => {
  const response = await instance.post('/auth/verify-email', body);
  return response.data;
};
