import { Auth } from '@/core/types';
import apiClient from '../axios';
import { ApiResponse } from '../types';
import { PostAuthKakaoSignInRequest } from './types';

const authAPI = {
  signIn: async (body: PostAuthKakaoSignInRequest): Promise<ApiResponse<Auth>> => {
    const response = await apiClient.post('/auth/kakao/login', body);
    return response.data;
  },
  signOut: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};

export default authAPI;
