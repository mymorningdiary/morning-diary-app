import { instance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';

export interface AuthenticationNumberRequest {
  type: 'SIGN_UP' | 'FIND_PASSWORD';
  email: string;
}

export const postAuthenticationNumber = async (
  body: AuthenticationNumberRequest,
): Promise<ApiResponse<null>> => {
  const response = await instance.post('/mail/authentication-number', body);
  return response.data;
};
