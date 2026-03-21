import { Logger } from '@shared/lib/log';
import { useMutation } from '@tanstack/react-query';
import { putUsersTextGoal } from '../api/put-users-text-goal';

interface Options {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useUpdateTextGoal({ onSuccess, onError }: Options) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: putUsersTextGoal,
    onSuccess: (res) => {
      if (res.code === 2000) {
        onSuccess?.();
      }
    },
    onError: (error: any) => {
      Logger('useUpdateTextGoal').error('Failed to update text goal', error);
      switch (error.code) {
        case 4105:
        case 4106:
        case 4107: {
          onError?.('목표 설정에 실패했어요 잠시 후 다시 시도해주세요');
          break;
        }
        case 5000:
        case 5002: {
          onError?.('서버 오류가 발생했어요 잠시 후 다시 시도해주세요');
          break;
        }
        default: {
          onError?.('목표 설정에 실패했어요 잠시 후 다시 시도해주세요');
          break;
        }
      }
    },
  });

  return {
    updateTextGoal: mutateAsync,
    isPending,
  };
}
