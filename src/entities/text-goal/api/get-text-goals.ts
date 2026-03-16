import { authInstance } from '@shared/api/client';
import { ApiResponse } from '@shared/api/types';
import { TextGoal, TextGoalData } from '../model/types';

export const getTextGoals = async (): Promise<ApiResponse<TextGoalData>> => {
  const response = await authInstance.get('/text-goals');
  return response.data;
};
