import { User } from '@/core/types';
import axiosInstance from '../axios';
import { ApiResponse } from '../types';
import { UpdateTextGoalRequest } from './types';

const userAPI = {
  getUser: async (): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get('/users/info');
    return response.data;
  },
  updateTextGoal: async (body: UpdateTextGoalRequest): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.put('/users/text-goal', body);
    return response.data;
  },
};

export default userAPI;
