import { User } from '@/core/types';
import axiosInstance from '../axios';
import { ApiResponse } from '../types';
import { UpdateGoalPageRequest } from './types';

const userAPI = {
  getUser: async (): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get('/users/info');
    return response.data;
  },
  updateGoalPage: async (body: UpdateGoalPageRequest): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.put('/users/goal-page', body);
    return response.data;
  },
};

export default userAPI;
