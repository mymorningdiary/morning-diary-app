import { postKakaoLogin, useAuth } from '@entities/auth';
import { login } from '@react-native-kakao/user';
import { Logger } from '@shared/lib/log';
import { useMutation } from '@tanstack/react-query';

interface Props {
  onLogin: (isExistUser: boolean) => void;
}

export function useKakaoLogin({ onLogin }: Props) {
  const { setAuth } = useAuth();
  const { mutateAsync, isPending } = useMutation({ mutationFn: postKakaoLogin });

  const loginWithKakao = async () => {
    if (isPending) return;

    try {
      const user = await login();
      const res = await mutateAsync({ accessToken: user.accessToken });

      if (res.code === 2000) {
        const { accessToken, refreshToken, isExistUser } = res.data;

        setAuth({ accessToken, refreshToken });
        onLogin(isExistUser ?? false);
      }
    } catch (e) {
      Logger('useKakaoLogin').error('Failed to sign in', e);
    }
  };

  return { loginWithKakao, isPending };
}
