import { instance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';

export interface VerifyPasswordRequest {
  email: string;
  authenticationNumber: string;
}

export interface VerifyPasswordResponse {
  passwordResetToken: string;
}

export const postVerifyPassword = async (
  body: VerifyPasswordRequest,
): Promise<ApiResponse<VerifyPasswordResponse>> => {
  const response = await instance.post('/auth/verify-password', body);
  return response.data;
};
