import { instance } from '@shared/api/client';
import { ApiResponse, Auth } from '@shared/api/types';

export interface PostSignUpRequest {
  email: string;
  password: string;
}

export const postSignUp = async (body: PostSignUpRequest): Promise<ApiResponse<Auth>> => {
  const response = await instance.post('/auth/sign-up', body);
  return response.data;
};
