import { useMutation } from '@tanstack/react-query';
import { postDuplicateEmail } from '../api/post-duplicate-email';

interface Options {
  onSuccess?: () => void;
  onError?: ({ type, message }: { type?: 'email' | null; message: string }) => void;
}

export function useCheckEmail({ onSuccess, onError }: Options) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: postDuplicateEmail,
    onSuccess,
    onError: (error: any) => {
      switch (error.code) {
        case 4013: {
          onError?.({ type: 'email', message: '이미 SNS 계정이 존재해요' });
          break;
        }
        case 4016: {
          onError?.({ type: 'email', message: '사용 중인 이메일이에요' });
          break;
        }
        case 5000:
        case 5002: {
          onError?.({ message: '서버 오류가 발생했어요 잠시 후 다시 시도해주세요' });
          break;
        }
        default: {
          onError?.({ message: '이메일 인증에 실패했어요 잠시 후 다시 시도해주세요' });
          break;
        }
      }
    },
  });

  return {
    checkEmail: mutateAsync,
    isPending,
  };
}
