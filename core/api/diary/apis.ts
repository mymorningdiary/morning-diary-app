import { Diaries, Diary } from '@/core/types';
import apiClient from '../axios';
import { ApiResponse } from '../types';
import {
  GetDiariesRequest,
  PostDiariesRequest,
  PostDiariesResponse,
  UpdateDiaryRequest,
  UpdateDiaryResponse,
} from './types';

const diaryAPI = {
  getDiaries: async (params: GetDiariesRequest): Promise<ApiResponse<Diaries>> => {
    const response = await apiClient.get('/diaries', { params });
    return response.data;
  },
  postDiaries: async (body: PostDiariesRequest): Promise<ApiResponse<PostDiariesResponse>> => {
    const response = await apiClient.post('/diaries', body);
    return response.data;
  },
  getDiary: async ({ diaryId }: { diaryId: number }): Promise<ApiResponse<Diary>> => {
    const response = await apiClient.get(`/diaries/${diaryId}`);
    return response.data;
  },
  deleteDiary: async ({ diaryId }: { diaryId: number }): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/diaries/${diaryId}`);
    return response.data;
  },
  updateDiary: async ({
    diaryId,
    body,
  }: {
    diaryId: number;
    body: UpdateDiaryRequest;
  }): Promise<ApiResponse<UpdateDiaryResponse>> => {
    const response = await apiClient.put(`/diaries/${diaryId}`, body);
    return response.data;
  },
};

export default diaryAPI;
