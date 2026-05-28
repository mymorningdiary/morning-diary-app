import { Logger } from '@shared/lib/log';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userQueryKeys } from '../../user';
import { deleteDiary } from '../api/delete-diaries';
import { diaryQueryKeys } from './queryKeys';

interface Options {
  date?: string; // YYYY-MM
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useDeleteDiary({ date, onSuccess, onError }: Options = {}) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteDiary,
    onSuccess: (res) => {
      if (res.code === 2000) {
        void queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
        void queryClient.invalidateQueries({ queryKey: diaryQueryKeys.list(date) });

        onSuccess?.();
      }
    },
    onError: (error: any) => {
      Logger('useDeleteDiary').error('Failed to delete diary', error);
      switch (error.code) {
        case 4206:
        case 4207: {
          onError?.('일기 삭제에 실패했어요 잠시 후 다시 시도해주세요');
          break;
        }
        case 4208: {
          onError?.('이미 일기가 삭제되었어요');
          break;
        }
        case 5000:
        case 5002: {
          onError?.('서버 오류가 발생했어요 잠시 후 다시 시도해주세요');
          break;
        }
        default: {
          onError?.('일기 삭제에 실패했어요 잠시 후 다시 시도해주세요');
          break;
        }
      }
    },
  });

  return {
    deleteDiary: mutateAsync,
    isPending,
  };
}
