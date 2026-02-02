import { useMutation } from '@tanstack/react-query';
import { postSignUp } from '../api/post-sign-up';
import { useAuth } from './useAuth';

interface Options {
  onSuccess?: (isExistUser: boolean) => void;
  onError?: ({ type, message }: { type?: 'email' | 'password' | null; message: string }) => void;
}

export function useSignUp({ onSuccess, onError }: Options) {
  const { setAuth } = useAuth();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: postSignUp,
    onSuccess: (res) => {
      if (res.code === 2000) {
        const { accessToken, refreshToken, isExistUser } = res.data;
        setAuth({ accessToken, refreshToken });
        onSuccess?.(isExistUser ?? false);
      }
    },
    onError: (error: any) => {
      switch (error.code) {
        case 4007:
        case 4008: {
          onError?.({ type: 'email', message: '올바르지 않은 이메일 형식이에요' });
          break;
        }
        case 4009:
        case 4010: {
          onError?.({ type: 'password', message: '올바르지 않은 비밀번호 형식이에요' });
          break;
        }
        case 4011: {
          onError?.({ type: 'email', message: '사용 중인 이메일이에요' });
          break;
        }
        case 5000:
        case 5002: {
          onError?.({ message: '서버 오류가 발생했어요' });
          break;
        }
        default: {
          onError?.({ message: '회원가입에 실패했어요 잠시 후 다시 시도해주세요' });
          break;
        }
      }
    },
  });

  return {
    signUp: mutateAsync,
    isPending,
  };
}
