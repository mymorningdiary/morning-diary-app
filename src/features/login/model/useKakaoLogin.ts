import { useAppState } from '@/contexts/AppStateContext';
import { login } from '@react-native-kakao/user';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Logger } from '@shared/lib/log';
import { postKakaoLogin } from '@entities/auth';

export function useKakaoLogin() {
  const { setAuthToken } = useAppState();
  const { mutateAsync, isPending } = useMutation({ mutationFn: postKakaoLogin });

  const loginWithKakao = async () => {
    if (isPending) return;

    try {
      const user = await login();
      const res = await mutateAsync({ accessToken: user.accessToken });
      if (res.code !== 2000) return;

      const { accessToken, refreshToken, isExistUser } = res.data;
      setAuthToken({ accessToken, refreshToken });

      router.replace(isExistUser ? '/(app)' : '/(app)/alarm-permission');
    } catch (e) {
      Logger('useKakaoLogin').error('Failed to sign in', e);
    }
  };

  return { loginWithKakao, isPending };
}
