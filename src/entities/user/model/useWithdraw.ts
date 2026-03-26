import { logout } from '@react-native-kakao/user';
import { useMutation } from '@tanstack/react-query';

import { Logger } from '@shared/lib/log';
import { patchUsersStatus } from '../api/patch-users-status';
import { useUser } from './useUser';
import { useAuth } from '@entities/auth';

interface Options {
  onSuccess?: () => void;
  onError?: (message?: string) => void;
}

export function useWithdraw({ onSuccess, onError }: Options) {
  const { user } = useUser();
  const { clearAuth } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: patchUsersStatus,
    onSuccess: async (res) => {
      if (res.code !== 2000) return;

      try {
        if (user?.loginType === 'KAKAO') {
          await logout();
        }

        clearAuth();
        onSuccess?.();
      } catch (error) {
        Logger('useWithdraw').error('Failed to sign out after withdrawal', error);
      }
    },
    onError: (error: any) => {
      Logger('useWithdraw').error('Failed to update text goal', error);
      switch (error.code) {
        case 4001: {
          onError?.('회원 탈퇴에 실패했어요 잠시 후 다시 시도해주세요');
          break;
        }
        case 5000:
        case 5002: {
          onError?.('서버 오류가 발생했어요 잠시 후 다시 시도해주세요');
          break;
        }
        default: {
          onError?.('회원 탈퇴에 실패했어요 잠시 후 다시 시도해주세요');
          break;
        }
      }
    },
  });

  return {
    withdraw: mutate,
    isPending,
  };
}
