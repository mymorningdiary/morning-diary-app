import { Auth } from '@/core/types';
import { instance } from '@shared/api/client';
import { ApiResponse } from '../types';
import { PostMailAuthenticationNumber } from './types';

const mailAPI = {
  postAuthenticationNumber: async (
    body: PostMailAuthenticationNumber,
  ): Promise<ApiResponse<Auth>> => {
    const response = await instance.post('/mail/authentication-number', body);
    return response.data;
  },
};

export default mailAPI;
