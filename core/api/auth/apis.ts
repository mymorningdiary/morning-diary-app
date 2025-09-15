import { Auth } from '@/core/types';
import apiClient from '../axios';
import { ApiResponse } from '../types';
import { PostAuthKakaoSignInRequest } from './types';

const authAPI = {
  kakaoSignIn: async (body: PostAuthKakaoSignInRequest): Promise<ApiResponse<Auth>> => {
    const response = await apiClient.post('/auth/kakao/login', body);
    return response.data;
  },
  refreshToken: async (): Promise<ApiResponse<Auth>> => {
    const response = await apiClient.post('auth/token');
    return response.data;
  },
};

export default authAPI;
