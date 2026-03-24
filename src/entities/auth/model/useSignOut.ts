import { useMutation } from '@tanstack/react-query';
import { postLogout } from '../api/post-logout';
import { useAuth } from './useAuth';
import { Logger } from '@shared/lib/log';

interface Options {
  onSuccess?: () => void;
  onError?: (message?: string) => void;
}

export function useSignOut({ onSuccess, onError }: Options) {
  const { clearAuth } = useAuth();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: postLogout,
    onSuccess: (res) => {
      if (res.code === 2000) {
        clearAuth();
        onSuccess?.();
      }
    },
    onError: (error: any) => {
      Logger('useSignOut').debug('Failed to sign out:', error);
      switch (error.code) {
        case 4001:
        case 4002:
        case 4003: {
          onError?.('로그아웃에 실패했어요 잠시 후 다시 시도해주세요');
          break;
        }
        case 5000:
        case 5002: {
          onError?.('서버 오류가 발생했어요 잠시 후 다시 시도해주세요');
          break;
        }
        default: {
          onError?.('로그아웃에 실패했어요 잠시 후 다시 시도해주세요');
          break;
        }
      }
    },
  });

  return {
    signOut: mutateAsync,
    isPending,
  };
}
