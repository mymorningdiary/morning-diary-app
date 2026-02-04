import { postSignIn, useAuth } from '@entities/auth';
import { Logger } from '@shared/lib/log';

import { useMutation } from '@tanstack/react-query';

interface Props {
  onSuccess?: (isExistUser: boolean) => void;
  onError?: ({ type, message }: { type?: 'email' | 'password'; message: string }) => void;
}

export function useLoginEmail({ onSuccess, onError }: Props) {
  const { setAuth } = useAuth();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: postSignIn,
    onSuccess: (res) => {
      if (res.code === 2000) {
        const { accessToken, refreshToken, isExistUser } = res.data;

        setAuth({ accessToken, refreshToken });
        onSuccess?.(isExistUser ?? false);
      }
    },
    onError: (error: any) => {
      Logger('useLoginEmail').error('Failed to login with email:', error.message);

      switch (error.code) {
        case 4000: {
          onError?.({ type: 'email', message: '존재하지 않는 사용자에요' });
          break;
        }
        case 4007:
        case 4008: {
          onError?.({ type: 'email', message: '이메일을 올바르게 입력해주세요' });
          break;
        }
        case 4009:
        case 4010: {
          onError?.({
            type: 'password',
            message: '비밀번호를 입력해주세요 (영문자+숫자+특수문자 10-64자)',
          });
          break;
        }
        case 4012: {
          onError?.({
            type: 'password',
            message: '비밀번호가 일치하지 않아요',
          });
          break;
        }
        case 4013: {
          onError?.({ message: 'SNS 계정 연동 사용자에요' });
          break;
        }
        default: {
          onError?.({ message: '로그인에 실패했어요 잠시 후 다시 시도해주세요' });
        }
      }
    },
  });

  return { loginEmail: mutateAsync, isPending };
}
