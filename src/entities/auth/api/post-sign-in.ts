import { instance } from '@shared/api/client';
import { ApiResponse, Auth } from '@shared/api/types';

export interface SignInRequest {
  email: string;
  password: string;
}

export const postSignIn = async (body: SignInRequest): Promise<ApiResponse<Auth>> => {
  const response = await instance.post('/auth/sign-in', body);
  return response.data;
};
