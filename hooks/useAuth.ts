import { useEffect, useState } from 'react';
import { useApiMutation } from './useApi';
import { SessionManager } from '@/core/storage';
import { Auth } from '@/core/api';
import { Nullable } from '@/types';
import { ScreenName } from '@/constants/utils';

export const useAuth = () => {
  const {
    mutate: loginWithKakao,
    data: loginResponse,
    isPending: isLoginLoading,
    error: loginError,
  } = useApiMutation<Auth.PostKakaoLoginRequest, Auth.PostKakaoLoginResponse>({
    path: '/auth/kakao/login',
  });

  const {
    mutate: autoLogin,
    data: autoLoginResponse,
    isPending: isAutoLoginLoading,
    error: autoLoginError,
  } = useApiMutation<void, Auth.PostAutoLoginResponse>(
    {
      path: '/auth/auto-login',
    },
    {
      requiresAuth: true,
    },
  );

  const [isExistUser, setIsExistUser] = useState<Nullable<boolean>>(null);
  const [nextScreen, setNextScreen] = useState<Nullable<ScreenName>>(null);

  useEffect(() => {
    if (!loginResponse) return;
    const { code, data } = loginResponse;

    if (code === 2000 && data !== undefined) {
      SessionManager.setSessionInfo({ accessToken: data.token });
      setIsExistUser(data.isExistUser);
    }
  }, [loginResponse]);

  const handleAutoLogin = async () => {
    const isFirstLaunch = await SessionManager.isFirstLaunch();

    if (isFirstLaunch) {
      await SessionManager.setIsFirstLaunch();
      setNextScreen(ScreenName.ONBOARDING);
    } else {
      autoLogin();
    }
  };

  useEffect(() => {
    if (!autoLoginResponse) return;
    const { code, data } = autoLoginResponse;

    if (code === 2000 && data !== undefined) {
      SessionManager.setSessionInfo({ accessToken: data.token });
      setNextScreen(ScreenName.MAIN);
    } else {
      setNextScreen(ScreenName.LOGIN);
    }
  }, [autoLoginResponse]);

  useEffect(() => {
    if (autoLoginError) {
      console.error('autoLoginError', autoLoginError);
      setNextScreen(ScreenName.LOGIN);
    }
  }, [autoLoginError]);

  return {
    loginWithKakao,
    isLoginLoading,
    loginError,
    isExistUser,
    autoLogin: handleAutoLogin,
    isAutoLoginLoading,
    autoLoginError,
    nextScreen,
  };
};
