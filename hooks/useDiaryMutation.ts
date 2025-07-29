import { ApiErrorResponse, diaryAPI } from '@/core/api';
import {
  PostDiariesRequest,
  PostDiariesResponse,
  UpdateDiaryResponse,
} from '@/core/api/diary/types';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';

export const useWriteDiary = () => {
  const [writeDiaryResponse, setWriteDiaryResponse] = useState<PostDiariesResponse | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: diaryAPI.postDiaries,
    onSuccess: async (response) => {
      switch (response.code) {
        case 2000:
          console.log(response.data);
          setWriteDiaryResponse(response.data);
          break;
        default:
          break;
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('[Diary Mutation] Failed to write diary:', error.response?.data);
    },
  });

  return { mutate, isPending, writeDiaryResponse };
};

export const useRemoveDiary = ({ diaryId }: { diaryId: number }) => {
  const [isRemoved, setIsRemoved] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => diaryAPI.deleteDiary({ diaryId }),
    onSuccess: async (response) => {
      switch (response.code) {
        case 2000:
          console.log(response.data);
          setIsRemoved(true);
          break;
        default:
          break;
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('[Diary Mutation] Failed to delete diary:', error.response?.data);
    },
  });

  return { mutate, isPending, isRemoved };
};

export const useUpdateDiary = () => {
  const [updateDiaryResponse, setUpdateDiaryResponse] = useState<UpdateDiaryResponse | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: diaryAPI.updateDiary,
    onSuccess: async (response) => {
      switch (response.code) {
        case 2000:
          console.log(response.data);
          setUpdateDiaryResponse(response.data);
          break;
        default:
          break;
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('[Diary Mutation] Failed to update diary:', error.response?.data);
    },
  });

  return { mutate, isPending, updateDiaryResponse };
};
