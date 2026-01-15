import { postKakaoLogin, useAuth } from '@entities/auth';
import { Logger } from '@shared/lib/log';
import { useMutation } from '@tanstack/react-query';
import { signInAsync, AppleAuthenticationScope } from 'expo-apple-authentication';

interface Props {
  onSuccess: (isExistUser: boolean) => void;
  onError: (message: string) => void;
}

export function useAppleLogin({ onSuccess, onError }: Props) {
  const { setAuth } = useAuth();
  const { mutateAsync, isPending } = useMutation({ mutationFn: postKakaoLogin });

  const appleLogin = async () => {
    if (isPending) return;

    try {
      const credential = await signInAsync({
        requestedScopes: [AppleAuthenticationScope.FULL_NAME, AppleAuthenticationScope.EMAIL],
      });

      Logger('useAppleLogin').debug('Success to apple login', credential);

      if (credential.identityToken) {
        // const res = await mutateAsync({ accessToken: credential.identityToken });
        // if (res.code === 2000) {
        //   const { accessToken, refreshToken, isExistUser } = res.data;
        //   setAuth({ accessToken, refreshToken });
        //   onSuccess(isExistUser ?? false);
        // } else {
        //   onError('애플 로그인에 실패했습니다');
        // }
      }
    } catch (e) {
      Logger('useAppleLogin').error('Failed to apple login', e);
      if (e.code === 'ERR_REQUEST_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }

      onError('애플 로그인에 실패했습니다');
    }
  };

  return { appleLogin, isPending };
}
