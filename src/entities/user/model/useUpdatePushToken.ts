import { Logger } from '@shared/lib/log';
import { useMutation } from '@tanstack/react-query';
import { putUsersPushToken } from '../api/put-users-push-token';

interface Options {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useUpdatePushToken({ onSuccess, onError }: Options = {}) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: putUsersPushToken,
    onSuccess: (res) => {
      if (res.code === 2000) {
        onSuccess?.();
      }
    },
    onError: (error: any) => {
      Logger('useUpdatePushToken').error('Failed to update push token', error);
      switch (error.code) {
        case 5000:
        case 5002: {
          onError?.('서버 오류가 발생했어요 잠시 후 다시 시도해주세요');
          break;
        }
      }
    },
  });

  return {
    updatePushToken: mutateAsync,
    isPending,
  };
}
