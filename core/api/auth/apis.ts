import { Auth } from '@/core/types';
import axiosInstance from '../axios';
import { ApiResponse } from '../types';
import { PostAuthKakaoLoginRequest } from './types';

const authAPI = {
  loginWithKakao: async (body: PostAuthKakaoLoginRequest): Promise<ApiResponse<Auth>> => {
    const response = await axiosInstance.post('/auth/kakao/login', body);
    return response.data;
  },

  autoLogin: async (): Promise<ApiResponse<Auth>> => {
    const response = await axiosInstance.post('/auth/auto-login');
    return response.data;
  },
};

export default authAPI;
