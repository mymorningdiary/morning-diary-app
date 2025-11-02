import { Auth } from '@/core/types';
import apiClient from '../axios';
import { ApiResponse } from '../types';
import {
  PostAuthSignUpRequest,
  PostAuthSignInRequest,
  PostAuthKakaoLoginInRequest,
  PostAuthVerifyEmailRequest,
  PostAuthDuplicateEmailRequest,
} from './types';

const authAPI = {
  postKakaoLogin: async (body: PostAuthKakaoLoginInRequest): Promise<ApiResponse<Auth>> => {
    const response = await apiClient.post('/auth/kakao/login', body);
    return response.data;
  },
  postSignUp: async (body: PostAuthSignUpRequest): Promise<ApiResponse<Auth>> => {
    const response = await apiClient.post('/auth/sign-up', body);
    return response.data;
  },
  postSignIn: async (body: PostAuthSignInRequest): Promise<ApiResponse<Auth>> => {
    const response = await apiClient.post('/auth/sign-in', body);
    return response.data;
  },
  postVerifyEmail: async (body: PostAuthVerifyEmailRequest): Promise<ApiResponse<null>> => {
    const response = await apiClient.post('/auth/verify-email', body);
    return response.data;
  },
  postDuplicateEmail: async (body: PostAuthDuplicateEmailRequest): Promise<ApiResponse<null>> => {
    const response = await apiClient.post('/auth/duplicate-email', body);
    return response.data;
  },
  postLogout: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};

export default authAPI;
