import axiosInstance from '../axios';
import { ApiResponse } from '../types';
import { GetTextGoalsData } from './types';

const textGoalAPI = {
  getTextGoals: async (): Promise<ApiResponse<GetTextGoalsData>> => {
    const response = await axiosInstance.get('/text-goals');
    return response.data;
  },
};

export default textGoalAPI;
