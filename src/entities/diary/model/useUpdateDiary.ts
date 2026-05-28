import { Logger } from '@shared/lib/log';
import { useMutation } from '@tanstack/react-query';
import { putDiaries } from '../api/put-diaries';

interface Options {
  date?: string; // YYYY-MM
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useUpdateDiary({ date, onSuccess, onError }: Options) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: putDiaries,
    onSuccess: (res) => {
      if (res.code === 2000) {
        onSuccess?.();
      }
    },
    onError: (error: any) => {
      Logger('useUpdateDiary').error('Failed to update diary', error);
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
        case 4205:
        case 4206:
        case 4207: {
          onError?.('일기 수정에 실패했어요 잠시 후 다시 시도해주세요');
          break;
        }
        case 5000:
        case 5002: {
          onError?.('서버 오류가 발생했어요 잠시 후 다시 시도해주세요');
          break;
        }
        default: {
          onError?.('일기 수정에 실패했어요 잠시 후 다시 시도해주세요');
          break;
        }
      }
    },
  });

  return {
    updateDiary: mutateAsync,
    isPending,
  };
}
