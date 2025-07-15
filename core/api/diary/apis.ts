import { Diaries, Diary } from '@/core/types';
import axiosInstance from '../axios';
import { ApiResponse } from '../types';
import { GetDiariesRequest, PostDiariesRequest, PostDiariesResponse } from './types';

const diaryAPI = {
  getDiaries: async (params: GetDiariesRequest): Promise<ApiResponse<Diaries>> => {
    const response = await axiosInstance.get('/diaries', { params });
    return response.data;
  },
  postDiaries: async (body: PostDiariesRequest): Promise<ApiResponse<PostDiariesResponse>> => {
    const response = await axiosInstance.post('/diaries', body);
    return response.data;
  },
  getDiary: async ({ diaryId }: { diaryId: number }): Promise<ApiResponse<Diary>> => {
    const response = await axiosInstance.get(`/diaries/${diaryId}`);
    return response.data;
  },
};

export default diaryAPI;
