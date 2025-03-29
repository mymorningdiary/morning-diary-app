import { useCallback, useEffect, useState } from 'react';
import { useApiMutation } from './useApi';
import { SessionManager } from '@/core/storage';
import { Auth } from '@/core/api';
import { Nullable } from '@/types';
import { ScreenName } from '@/constants/utils';
import { useStorageSaveItem } from './useStorage';
import { USER_INFO_GOAL_PAGE, USER_INFO_ALARM_TIME } from '@/constants/storage';

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
      requireAuth: true,
    },
  );

  const { mutate: saveUserGoalPage } = useStorageSaveItem<number>(USER_INFO_GOAL_PAGE);
  const { mutate: saveUserAlarmTime } = useStorageSaveItem<string>(USER_INFO_ALARM_TIME);

  const [isExistUser, setIsExistUser] = useState<Nullable<boolean>>(null);
  const [nextScreen, setNextScreen] = useState<Nullable<ScreenName>>(null);

  const saveUserInfo = useCallback(
    (token: string, goalPage: number, alarmTime: string) => {
      saveUserGoalPage(goalPage);
      saveUserAlarmTime(alarmTime);
      SessionManager.setSessionInfo({ accessToken: token });
    },
    [saveUserGoalPage, saveUserAlarmTime],
  );

  useEffect(() => {
    if (!loginResponse) return;
    const { code, data } = loginResponse;

    if (code === 2000 && data !== undefined) {
      const { token, goalPage, alarmTime } = data;

      saveUserInfo(token, goalPage, alarmTime);
      setIsExistUser(data.isExistUser);
    }
  }, [loginResponse, saveUserInfo]);

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
      const { token, goalPage, alarmTime } = data;

      saveUserInfo(token, goalPage, alarmTime);
      setNextScreen(ScreenName.MAIN);
    } else {
      setNextScreen(ScreenName.LOGIN);
    }
  }, [autoLoginResponse, saveUserInfo]);

  useEffect(() => {
    if (autoLoginError) {
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
