import { User } from '@/core/types';
import axiosInstance from '../axios';
import { ApiResponse } from '../types';
import { UpdateGoalPageRequest } from './types';

const userApi = {
  getUser: async (): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  updateGoalPage: async (data: UpdateGoalPageRequest): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.put('/users/goal-page', data);
    return response.data;
  },
};

export default userApi;
