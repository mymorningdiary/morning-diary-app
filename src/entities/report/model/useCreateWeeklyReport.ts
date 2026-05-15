import { Logger } from '@shared/lib/log';
import { useMutation } from '@tanstack/react-query';
import { postWeeklyReports } from '../api/post-weekly-reports';

interface Options {
  onSuccess?: (weeklyReportId: number) => void;
  onError?: (message: string) => void;
}

export function useCreateWeeklyReport({ onSuccess, onError }: Options) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: postWeeklyReports,
    onSuccess: (res) => {
      if (res.code === 2000) {
        onSuccess?.(res.data.weeklyReportId);
      }
    },
    onError: (error: any) => {
      Logger('useCreateWeeklyReport').error('Failed to post weekly reports', error);
      switch (error.code) {
        case 4220: {
          onError?.('주간 리포트는 일요일에 열 수 있어요');
          break;
        }
        case 4221: {
          onError?.('금주의 일기를 3번 이상 작성해야 주간 리포트를 열 수 있어요');
          break;
        }
        case 4222: {
          onError?.('금주의 주간리포트를 이미 열었어요');
          break;
        }
        case 5000:
        case 5002: {
          onError?.('서버 오류가 발생했어요 잠시 후 다시 시도해주세요');
          break;
        }
        default: {
          onError?.('주간 리포트 여는데 실패했어요');
          break;
        }
      }
    },
  });

  return {
    createReport: mutateAsync,
    isPending,
  };
}
