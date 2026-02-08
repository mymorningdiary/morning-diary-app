import { postAppleLogin, useAuth } from '@entities/auth';
import { Logger } from '@shared/lib/log';
import { useMutation } from '@tanstack/react-query';
import { AppleAuthenticationScope, signInAsync } from 'expo-apple-authentication';
import Constants from 'expo-constants';

interface Props {
  onSuccess?: (isExistUser: boolean) => void;
  onError?: (message: string) => void;
}

export function useLoginApple({ onSuccess, onError }: Props) {
  const { setAuth } = useAuth();
  const { mutateAsync, isPending } = useMutation({ mutationFn: postAppleLogin });
  const appVariant = Constants?.expoConfig?.extra?.appVariant ?? 'production';

  const appleLogin = async () => {
    if (isPending) return;

    try {
      const credential = await signInAsync({
        requestedScopes: [AppleAuthenticationScope.FULL_NAME, AppleAuthenticationScope.EMAIL],
      });

      if (credential.identityToken) {
        const res = await mutateAsync({
          identityToken: credential.identityToken,
          isPreview: appVariant === 'preview',
        });
        if (res.code === 2000) {
          const { accessToken, refreshToken, isExistUser } = res.data;
          setAuth({ accessToken, refreshToken });
          onSuccess?.(isExistUser ?? false);
        }
      }
    } catch (error: any) {
      Logger('useLoginApple').error('Failed to login with apple:', error);

      switch (error.code) {
        case 4007: {
          onError?.('이메일을 확인하지 못했어요');
          break;
        }
        // invalid apple identity token
        case 4015: {
          onError?.('애플 로그인 정보를 확인할 수 없어요 다시 로그인해주세요');
          break;
        }
        case 4016: {
          onError?.('이미 이메일 계정이 존재해요');
          break;
        }
        case 5000:
        case 5002: {
          onError?.('서버 오류가 발생했어요');
          break;
        }
        case 'ERR_REQUEST_NOT_INTERACTIVE': {
          onError?.('로그인 화면에서 다시 시도해주세요');
          break;
        }
        case 'ERR_REQUEST_FAILED':
        case 'ERR_REQUEST_NOT_HANDLED':
        case 'ERR_REQUEST_UNKNOWN': {
          onError?.('애플 로그인에 실패했어요 잠시 후 다시 시도해주세요');
          break;
        }
        case 'ERR_REQUEST_CANCELED':
        case 'ERR_INVALID_OPERATION':
        case 'ERR_INVALID_SCOPE':
        case 'ERR_INVALID_RESPONSE':
          break;
        default: {
          onError?.('애플 로그인에 실패했어요 잠시 후 다시 시도해주세요');
          break;
        }
      }
    }
  };

  return { appleLogin, isPending };
}
