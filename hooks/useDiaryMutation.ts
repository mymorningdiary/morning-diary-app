import { ApiErrorResponse, diaryAPI } from '@/core/api';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useWriteDiary = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: diaryAPI.postDiaries,
    onSuccess: async (response) => {
      switch (response.code) {
        case 2000:
          console.log(response.data);
        default:
          console.log(response);
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('[Diary Mutation] Failed to write diary:', error.response?.data);
    },
  });

  return { mutate, isPending };
};
