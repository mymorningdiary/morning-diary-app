import { Diaries } from '@/core/types';
import axiosInstance from '../axios';
import { ApiResponse } from '../types';

const textGoalAPI = {
  getTextGoals: async (): Promise<ApiResponse<Diaries>> => {
    const response = await axiosInstance.get('/text-goals');
    return response.data;
  },
};

export default textGoalAPI;
