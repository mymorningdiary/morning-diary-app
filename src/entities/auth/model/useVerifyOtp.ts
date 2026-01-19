import { useMutation } from '@tanstack/react-query';
import { postVerifyEmail } from '../api/post-verify-email';
import { Logger } from '@shared/lib/log';

interface Options {
  onSuccess?: () => void;
  onError?: ({ type, message }: { type?: 'email' | 'otp' | null; message: string }) => void;
}

export function useVerifyOtp({ onSuccess, onError }: Options) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: postVerifyEmail,
    onSuccess,
    onError: (error: any) => {
      switch (error.code) {
        case 4007:
        case 4008: {
          onError?.({ type: 'email', message: '올바르지 않은 이메일 형식이에요' });
          break;
        }
        case 4402:
        case 4403:
        case 4405: {
          onError?.({ type: 'otp', message: '인증 번호를 다시 입력해 주세요' });
          break;
        }
        case 4404: {
          onError?.({ type: 'otp', message: '인증시간이 만료되었어요' });
          break;
        }
        case 4406: {
          onError?.({ type: 'otp', message: '인증 번호가 일치하지 않아요' });
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
    verifyOtp: mutateAsync,
    isPending,
  };
}
