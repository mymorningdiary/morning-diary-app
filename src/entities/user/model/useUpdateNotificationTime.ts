import { useMutation } from '@tanstack/react-query';

import { Logger } from '@shared/lib/log';
import { putUsersAlarmTime } from '../api/put-users-alarm-time';

interface Options {
  onSuccess?: () => void;
  onError?: (message?: string) => void;
}

export function useUpdateNotificationTime({ onSuccess, onError }: Options = {}) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: putUsersAlarmTime,
    onSuccess: (res) => {
      if (res.code === 2000) {
        onSuccess?.();
      }
    },
    onError: (error: any) => {
      Logger('useUpdateNotificationTime').error('Failed to update notification time', error);
      switch (error.code) {
        case 4100:
        case 4101: {
          onError?.('알림 시간 변경에 실패했어요 잠시 후 다시 시도해주세요');
          break;
        }
        case 5000:
        case 5002: {
          onError?.('서버 오류가 발생했어요 잠시 후 다시 시도해주세요');
          break;
        }
      }
    },
  });

  return {
    updateNotificationTime: mutateAsync,
    isPending,
  };
}
