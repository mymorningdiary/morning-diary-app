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
        case 4000: {
          onError?.({ type: 'email', message: '존재하지 않은 사용자에요' });
          break;
        }
        case 4007: {
          onError?.({ message: '인증 번호 보내기에 실패했어요' });
          break;
        }
        case 4014: {
          onError?.({ message: 'SNS 계정 사용자는 비밀번호를 변경할 수 없어요' });
          break;
        }
        case 4008: {
          onError?.({ type: 'email', message: '올바르지 않은 이메일 형식이에요' });
          break;
        }
        case 4400:
        case 4401: {
          Logger('useRequestOtp').debug('Failed to request otp:', error.message);
          break;
        }
        case 5000:
        case 5002: {
          onError?.({ message: '서버 오류가 발생했어요 잠시 후 다시 시도해주세요' });
          break;
        }
        default: {
          onError?.({ message: '인증 번호 요청에 실패했어요 잠시 후 다시 시도해주세요' });
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
