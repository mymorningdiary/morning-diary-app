import { Diaries, Diary } from '@/core/types';
import axiosInstance from '../axios';
import { ApiResponse } from '../types';
import {
  GetDiariesRequest,
  PostDiariesRequest,
  PostDiariesResponse,
  GetDiaryRequest,
} from './types';

const diaryAPI = {
  getDiaries: async (params: GetDiariesRequest): Promise<ApiResponse<Diaries>> => {
    const response = await axiosInstance.get('/diaries', { params });
    return response.data;
  },
  postDiaries: async (body: PostDiariesRequest): Promise<ApiResponse<PostDiariesResponse>> => {
    const response = await axiosInstance.post('/diaries', body);
    return response.data;
  },
  getDiary: async (params: GetDiaryRequest): Promise<ApiResponse<Diary>> => {
    const response = await axiosInstance.get('/diaries', { params });
    return response.data;
  },
};

export default diaryAPI;
