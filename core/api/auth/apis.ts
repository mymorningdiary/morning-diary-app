import { Auth } from '@/core/types';
import { authInstance, instance } from '@shared/api/client';
import { ApiResponse } from '../types';
import {
  PostAuthDuplicateEmailRequest,
  PostAuthKakaoLoginInRequest,
  PostAuthSignInRequest,
  PostAuthSignUpRequest,
  PostAuthVerifyEmailRequest,
} from './types';

const authAPI = {
  postKakaoLogin: async (body: PostAuthKakaoLoginInRequest): Promise<ApiResponse<Auth>> => {
    const response = await instance.post('/auth/kakao/login', body);
    return response.data;
  },
  postSignUp: async (body: PostAuthSignUpRequest): Promise<ApiResponse<Auth>> => {
    const response = await instance.post('/auth/sign-up', body);
    return response.data;
  },
  postSignIn: async (body: PostAuthSignInRequest): Promise<ApiResponse<Auth>> => {
    const response = await instance.post('/auth/sign-in', body);
    return response.data;
  },
  postVerifyEmail: async (body: PostAuthVerifyEmailRequest): Promise<ApiResponse<null>> => {
    const response = await instance.post('/auth/verify-email', body);
    return response.data;
  },
  postDuplicateEmail: async (body: PostAuthDuplicateEmailRequest): Promise<ApiResponse<null>> => {
    const response = await instance.post('/auth/duplicate-email', body);
    return response.data;
  },
  postLogout: async (): Promise<ApiResponse<null>> => {
    const response = await authInstance.post('/auth/logout');
    return response.data;
  },
};

export default authAPI;
