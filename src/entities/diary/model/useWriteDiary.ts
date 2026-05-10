import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postDiaries } from '../api/post-diary';
import { Logger } from '@shared/lib/log';
import { userQueryKeys } from '../../user';
import { diaryQueryKeys } from './queryKeys';
import { homeQueryKeys } from '../../home';

interface Options {
  date?: string; // YYYY-MM
  onSuccess?: ({
    isFirstWritten,
    writtenTextLen,
  }: {
    isFirstWritten: boolean;
    writtenTextLen: number;
  }) => void;
  onError?: (message: string) => void;
}

export function useWriteDiary({ date, onSuccess, onError }: Options) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: postDiaries,
    onSuccess: (res) => {
      if (res.code === 2000) {
        void queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
        void queryClient.invalidateQueries({ queryKey: diaryQueryKeys.list(date) });
        void queryClient.invalidateQueries({ queryKey: homeQueryKeys.detail(date) });

        const { isFirstWrittenDiary, textLength } = res.data;
        onSuccess?.({ isFirstWritten: isFirstWrittenDiary, writtenTextLen: textLength });
      }
    },
    onError: (error: any) => {
      Logger('useWriteDiary').error('Failed to write diary', error);
      switch (error.code) {
        case 4200: {
          onError?.('일기 내용을 적어주세요');
          break;
        }
        case 4203: {
          onError?.('해당 날짜에 이미 일기를 작성했어요');
          break;
        }
        case 4204:
        case 4205: {
          onError?.('일기 작성에 실패했어요 잠시 후 다시 시도해주세요');
          break;
        }
        case 5000:
        case 5002: {
          onError?.('서버 오류가 발생했어요 잠시 후 다시 시도해주세요');
          break;
        }
        default: {
          onError?.('일기 작성에 실패했어요 잠시 후 다시 시도해주세요');
          break;
        }
      }
    },
  });

  return {
    writeDiary: mutateAsync,
    isPending,
  };
}
