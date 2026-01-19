import { useMutation } from '@tanstack/react-query';
import { postAuthenticationNumber } from '../api/post-authentication-number';
import { Logger } from '@shared/lib/log';

interface Options {
  onSuccess?: () => void;
  onError?: ({ type, message }: { type?: 'email' | null; message: string }) => void;
}

export function useRequestOtp({ onSuccess, onError }: Options) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: postAuthenticationNumber,
    onSuccess,
    onError: (error: any) => {
      switch (error.code) {
        case 4007: {
          onError?.({ message: '인증 번호 보내기에 실패했어요' });
          break;
        }
        case 4008: {
          onError?.({ type: 'email', message: '올바르지 않은 이메일 형식이에요' });
          break;
        }
        case 4400:
        case 4401: {
          Logger('useOtpMail').debug('Failed to request otp:', error.message);
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
    requestOtp: mutateAsync,
    isPending,
  };
}
