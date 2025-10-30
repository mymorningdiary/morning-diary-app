import { Auth } from '@/core/types';
import apiClient from '../axios';
import { ApiResponse } from '../types';
import { PostMailAuthenticationNumber } from './types';

const mailAPI = {
  postAuthenticationNumber: async (
    body: PostMailAuthenticationNumber,
  ): Promise<ApiResponse<Auth>> => {
    const response = await apiClient.post('/mail/authentication-number', body);
    return response.data;
  },
};

export default mailAPI;
