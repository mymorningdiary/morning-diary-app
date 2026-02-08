import { instance } from '@shared/api/client';
import { ApiResponse, Auth } from '@shared/api/types';

interface AppleLoginRequest {
  identityToken: string;
  isPreview: boolean;
}

export const postAppleLogin = async (body: AppleLoginRequest): Promise<ApiResponse<Auth>> => {
  const response = await instance.post('/auth/apple/login', body);
  return response.data;
};
