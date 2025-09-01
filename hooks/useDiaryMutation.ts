import { useAuth } from '@/contexts/AuthContext';
import { ApiError, diaryAPI } from '@/core/api';
import { PostDiariesResponse, UpdateDiaryResponse } from '@/core/api/diary/types';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';

export const useWriteDiary = () => {
  const { logout } = useAuth();

  const [writeDiaryResponse, setWriteDiaryResponse] = useState<PostDiariesResponse | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: diaryAPI.postDiaries,
    onSuccess: async (response) => {
      switch (response.code) {
        case 2000: {
          setWriteDiaryResponse(response.data);
          break;
        }
        case 4001:
        case 4002:
        case 4003: {
          logout();
          break;
        }
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error('[Diary Mutation] Failed to write diary:', error.response?.data);
    },
  });

  return { mutate, isPending, writeDiaryResponse };
};

export const useRemoveDiary = ({ diaryId }: { diaryId: number }) => {
  const { logout } = useAuth();

  const [isRemoved, setIsRemoved] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => diaryAPI.deleteDiary({ diaryId }),
    onSuccess: async (response) => {
      switch (response.code) {
        case 2000: {
          setIsRemoved(true);
          break;
        }
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      switch (error.response?.data.code) {
        case 4001:
        case 4002:
        case 4003: {
          logout();
          break;
        }
      }
    },
  });

  return { mutate, isPending, isRemoved };
};

export const useUpdateDiary = () => {
  const { logout } = useAuth();

  const [updateDiaryResponse, setUpdateDiaryResponse] = useState<UpdateDiaryResponse | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: diaryAPI.updateDiary,
    onSuccess: async (response) => {
      switch (response.code) {
        case 2000: {
          setUpdateDiaryResponse(response.data);
          break;
        }
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      switch (error.response?.data.code) {
        case 4001:
        case 4002:
        case 4003: {
          logout();
          break;
        }
      }
    },
  });

  return { mutate, isPending, updateDiaryResponse };
};
