import { Auth } from '@/core/types';
import axiosInstance from '../axios';
import { ApiResponse } from '../types';
import { PostKakaoLoginRequest } from './types';

const authAPi = {
  loginWithKakao: async (body: PostKakaoLoginRequest): Promise<ApiResponse<Auth>> => {
    const response = await axiosInstance.post('/auth/kakao/login', body);
    return response.data;
  },

  autoLogin: async (): Promise<ApiResponse<Auth>> => {
    const response = await axiosInstance.post('/auth/auto-login');
    return response.data;
  },
};

export default authAPi;
