import { useMutation } from '@tanstack/react-query';
import { putPasswordReset } from '../api/put-password-reset';

interface Options {
  onSuccess?: () => void;
  onError?: ({ type, message }: { type?: 'email' | 'password' | null; message: string }) => void;
}

export function useResetPassword({ onSuccess, onError }: Options) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: putPasswordReset,
    onSuccess,
    onError: (error: any) => {
      switch (error.code) {
        case 4000: {
          onError?.({ type: 'email', message: '존재하지 않은 사용자에요' });
          break;
        }
        case 4009:
        case 4010: {
          onError?.({ type: 'password', message: '비밀번호를 올바르게 입력해주세요' });
          break;
        }
        case 4014: {
          onError?.({ message: 'SNS 계정 사용자는 비밀번호를 변경할 수 없어요' });
          break;
        }
        case 4500:
        case 4501:
        case 4502: {
          onError?.({ message: '비밀번호 재설정에 실패했어요. 다시 시도해 주세요' });
          break;
        }
        default: {
          onError?.({ message: '서버 오류가 발생했어요' });
          break;
        }
      }
    },
  });

  return {
    resetPassword: mutateAsync,
    isPending,
  };
}
