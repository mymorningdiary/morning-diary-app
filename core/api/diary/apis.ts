import { Diaries } from '@/core/types';
import axiosInstance from '../axios';
import { ApiResponse } from '../types';
import { GetDiariesRequest } from './types';

const diaryAPI = {
  getDiaries: async (params: GetDiariesRequest): Promise<ApiResponse<Diaries>> => {
    const response = await axiosInstance.get('/diaries', { params });
    return response.data;
  },
};

export default diaryAPI;
