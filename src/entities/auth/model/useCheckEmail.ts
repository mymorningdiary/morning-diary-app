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
        case 4011: {
          onError?.({ type: 'email', message: '사용 중인 이메일이에요' });
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
    checkEmail: mutateAsync,
    isPending,
  };
}
