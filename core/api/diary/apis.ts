import { TextGoal } from '@/core/types';
import axiosInstance from '../axios';
import { ApiResponse } from '../types';
import { GetDiariesRequest, PostDiariesRequest, PostDiariesResponse } from './types';

const diaryAPI = {
  getTextGoals: async (params: GetDiariesRequest): Promise<ApiResponse<TextGoal>> => {
    const response = await axiosInstance.get('/diaries', { params });
    return response.data;
  },
};

export default diaryAPI;
