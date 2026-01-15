import { authInstance } from '@shared/api/client';
import { ApiResponse } from '../types';
import { GetTextGoalsData } from './types';

const textGoalAPI = {
  getTextGoals: async (): Promise<ApiResponse<GetTextGoalsData>> => {
    const response = await authInstance.get('/text-goals');
    return response.data;
  },
};

export default textGoalAPI;
