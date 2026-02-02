import { postKakaoLogin, useAuth } from '@entities/auth';
import { login } from '@react-native-kakao/user';
import { Logger } from '@shared/lib/log';

import { useMutation } from '@tanstack/react-query';

interface Props {
  onSuccess?: (isExistUser: boolean) => void;
  onError?: (message: string) => void;
}

export function useLoginKakao({ onSuccess, onError }: Props) {
  const { setAuth } = useAuth();
  const { mutateAsync, isPending } = useMutation({ mutationFn: postKakaoLogin });

  const kakaoLogin = async () => {
    if (isPending) return;

    try {
      const user = await login();
      const res = await mutateAsync({ accessToken: user.accessToken });

      if (res.code === 2000) {
        const { accessToken, refreshToken, isExistUser } = res.data;

        setAuth({ accessToken, refreshToken });
        onSuccess?.(isExistUser ?? false);
      }
    } catch (error: any) {
      Logger('useKakaoLogin').error('Failed to login with kakao:', error);

      switch (error.code) {
        case 4007: {
          onError?.('이메일을 확인하지 못했어요');
          break;
        }
        case 4011: {
          onError?.('이미 사용 중인 이메일이에요');
          break;
        }
        case 5000:
        case 5002: {
          onError?.('서버 오류가 발생했어요');
          break;
        }
        default: {
          onError?.('카카오 로그인에 실패했어요 잠시 후 다시 시도해주세요');
          break;
        }
      }
    }
  };

  return { kakaoLogin, isPending };
}
