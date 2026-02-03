import { useMutation } from '@tanstack/react-query';
import { postVerifyEmail, VerifyEmailRequest } from '../api/post-verify-email';
import {
  postVerifyPassword,
  VerifyPasswordRequest,
  VerifyPasswordResponse,
} from '../api/post-verify-password';
import { ApiResponse } from '@shared/api/types';

interface Options {
  type?: 'SIGN_UP' | 'FIND_PASSWORD';
  onSuccess?: (passwordResetToken?: string) => void;
  onError?: ({ type, message }: { type?: 'email' | 'otp' | null; message: string }) => void;
}

export function useVerifyOtp({ type = 'SIGN_UP', onSuccess, onError }: Options) {
  const { mutateAsync, isPending } = useMutation<
    ApiResponse<null | VerifyPasswordResponse>,
    any,
    VerifyEmailRequest | VerifyPasswordRequest
  >({
    mutationFn: type === 'SIGN_UP' ? postVerifyEmail : postVerifyPassword,
    onSuccess: (result) => {
      if (result.code === 2000) {
        onSuccess?.(result.data?.passwordResetToken);
      }
    },
    onError: (error: any) => {
      switch (error.code) {
        case 4007: {
          onError?.({ type: 'email', message: '존재하지 않은 사용자에요' });
          break;
        }
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
