import { instance } from '@shared/api/client';
import { ApiResponse, Auth } from '@shared/api/types';

export interface PostAuthSignInRequest {
  email: string;
  password: string;
}

export const postAuthSignIn = async (body: PostAuthSignInRequest): Promise<ApiResponse<Auth>> => {
  const response = await instance.post('/auth/sign-in', body);
  return response.data;
};
