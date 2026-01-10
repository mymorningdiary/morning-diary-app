import { postKakaoLogin, useAuth } from '@entities/auth';
import { login } from '@react-native-kakao/user';
import { Logger } from '@shared/lib/log';

import { useMutation } from '@tanstack/react-query';

interface Props {
  onSuccess: (isExistUser: boolean) => void;
  onError: (message: string) => void;
}

export function useKakaoLogin({ onSuccess, onError }: Props) {
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
        onSuccess(isExistUser ?? false);
      } else {
        onError('카카오 로그인에 실패했습니다');
      }
    } catch (e) {
      Logger('useKakaoLogin').error('Failed to kakao login', e);
      onError('카카오 로그인에 실패했습니다');
    }
  };

  return { kakaoLogin, isPending };
}
